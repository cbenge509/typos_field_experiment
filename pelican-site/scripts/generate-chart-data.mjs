// scripts/generate-chart-data.mjs
// Generates JSON data files from raw CSV for chart components

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths - handle worktree setup
// Worktree is at: /home/cbenge/github/typos_field_experiment/.worktrees/astro-site
// CSV is at: /home/cbenge/github/typos_field_experiment/R-analysis/final_data_cleaned.csv
const csvPath = '/home/cbenge/github/typos_field_experiment/R-analysis/final_data_cleaned.csv';
const dataDir = path.resolve(__dirname, '../src/data');

console.log('Looking for CSV at:', csvPath);

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read and parse CSV
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const { data: rawData } = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true,
});

console.log(`Parsed ${rawData.length} rows from CSV`);

// Helper function to determine data source (Amazon vs XLab)
function getSource(startDate) {
  if (!startDate) return 'Unknown';
  // Amazon dates are before April 5, 2021; XLab after
  const date = new Date(startDate);
  const cutoff = new Date('2021-04-05');
  return date < cutoff ? 'Amazon' : 'XLab';
}

// 1. Generate demographic data
function generateDemographicData() {
  // Get unique participants (by ROWID) for demographic counts
  const participantMap = new Map();
  for (const row of rawData) {
    if (!participantMap.has(row.ROWID)) {
      participantMap.set(row.ROWID, row);
    }
  }
  const participants = Array.from(participantMap.values());

  // Gender distribution
  const genderCounts = {};
  for (const p of participants) {
    const gender = p.Gender || 'Unknown';
    genderCounts[gender] = (genderCounts[gender] || 0) + 1;
  }
  const genderData = Object.entries(genderCounts)
    .map(([gender, count]) => ({ gender, count }))
    .sort((a, b) => b.count - a.count);

  // Country distribution
  const countryCounts = {};
  for (const p of participants) {
    const country = p.Country || 'Unknown';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  }
  const countryData = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  // State distribution (US only)
  const stateCounts = {};
  for (const p of participants) {
    if (p.Country === 'United States of America' && p.State) {
      stateCounts[p.State] = (stateCounts[p.State] || 0) + 1;
    }
  }
  const stateData = Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);

  // Age bins distribution
  const ageBinCounts = {};
  for (const p of participants) {
    const ageBin = p.age_bins || 'Unknown';
    ageBinCounts[ageBin] = (ageBinCounts[ageBin] || 0) + 1;
  }
  const ageBinData = Object.entries(ageBinCounts)
    .map(([ageBin, count]) => ({ ageBin, count }))
    .sort((a, b) => {
      // Sort by age order
      const order = ['18-25', '26-30', '31-35', '36-40', '41+', 'Unknown'];
      return order.indexOf(a.ageBin) - order.indexOf(b.ageBin);
    });

  return {
    gender: genderData,
    country: countryData,
    state: stateData,
    ageBins: ageBinData,
    totalParticipants: participants.length,
  };
}

// 2. Generate Likert divergence data (for bar divergence plots)
// Creates data with pctStart and pctEnd for divergence visualization
function generateDivergenceData() {
  const questions = ['Effective', 'Intelligence', 'Writing'];
  const treatments = ['Control', 'Typographical', 'Phonological'];
  const prompts = [...new Set(rawData.map(r => r.Prompt))];

  const result = {};

  for (const question of questions) {
    const questionData = [];

    for (const treatment of treatments) {
      for (const prompt of prompts) {
        // Count responses by rank for this treatment/prompt combo
        const counts = {};
        for (let rank = 1; rank <= 7; rank++) {
          counts[rank] = 0;
        }

        let total = 0;
        for (const row of rawData) {
          if (row.Treatment === treatment && row.Prompt === prompt) {
            const rank = row[question];
            if (rank >= 1 && rank <= 7) {
              counts[rank]++;
              total++;
            }
          }
        }

        // Calculate percentages
        const rankData = [];
        for (let rank = 1; rank <= 7; rank++) {
          const pctOfTotal = total > 0 ? (counts[rank] / total) * 100 : 0;
          rankData.push({
            treatment,
            prompt,
            rank,
            count: counts[rank],
            total,
            pctOfTotal,
          });
        }

        // Calculate divergence positions (centered on rank 4)
        // Rank 4 is centered at 0, ranks 1-3 go left, ranks 5-7 go right
        const rank4Pct = rankData.find(d => d.rank === 4)?.pctOfTotal || 0;
        let currentLeft = -rank4Pct / 2;
        let currentRight = rank4Pct / 2;

        // Assign pctStart and pctEnd for each rank
        for (const d of rankData) {
          if (d.rank === 4) {
            d.pctStart = -rank4Pct / 2;
            d.pctEnd = rank4Pct / 2;
          } else if (d.rank < 4) {
            // Ranks 1-3 go left of center
            d.pctEnd = currentLeft;
            d.pctStart = currentLeft - d.pctOfTotal;
            currentLeft = d.pctStart;
          } else {
            // Ranks 5-7 go right of center
            d.pctStart = currentRight;
            d.pctEnd = currentRight + d.pctOfTotal;
            currentRight = d.pctEnd;
          }
          questionData.push(d);
        }
      }
    }

    result[question.toLowerCase()] = questionData;
  }

  // Also create aggregated data by treatment (averaging across prompts)
  const aggregated = {};
  for (const question of questions) {
    aggregated[question.toLowerCase()] = [];

    for (const treatment of treatments) {
      const treatmentData = result[question.toLowerCase()].filter(d => d.treatment === treatment);

      // Sum counts across prompts for each rank
      for (let rank = 1; rank <= 7; rank++) {
        const rankItems = treatmentData.filter(d => d.rank === rank);
        const totalCount = rankItems.reduce((sum, d) => sum + d.count, 0);
        const grandTotal = rankItems.reduce((sum, d) => sum + d.total, 0);
        const pctOfTotal = grandTotal > 0 ? (totalCount / grandTotal) * 100 : 0;

        aggregated[question.toLowerCase()].push({
          treatment,
          rank,
          count: totalCount,
          total: grandTotal,
          pctOfTotal,
        });
      }
    }

    // Calculate divergence positions for aggregated data
    for (const treatment of treatments) {
      const treatmentData = aggregated[question.toLowerCase()].filter(d => d.treatment === treatment);
      const rank4 = treatmentData.find(d => d.rank === 4);
      const rank4Pct = rank4?.pctOfTotal || 0;

      let currentLeft = -rank4Pct / 2;
      let currentRight = rank4Pct / 2;

      // Sort by rank to process in order
      treatmentData.sort((a, b) => a.rank - b.rank);

      for (const d of treatmentData) {
        if (d.rank === 4) {
          d.pctStart = -rank4Pct / 2;
          d.pctEnd = rank4Pct / 2;
        }
      }

      // Process ranks 3, 2, 1 (left side)
      for (let r = 3; r >= 1; r--) {
        const d = treatmentData.find(item => item.rank === r);
        if (d) {
          d.pctEnd = currentLeft;
          d.pctStart = currentLeft - d.pctOfTotal;
          currentLeft = d.pctStart;
        }
      }

      // Process ranks 5, 6, 7 (right side)
      for (let r = 5; r <= 7; r++) {
        const d = treatmentData.find(item => item.rank === r);
        if (d) {
          d.pctStart = currentRight;
          d.pctEnd = currentRight + d.pctOfTotal;
          currentRight = d.pctEnd;
        }
      }
    }
  }

  return { byPrompt: result, aggregated };
}

// 3. Generate Likert variance data
function generateLikertVarianceData() {
  // Get unique participants with their Likert variance
  const participantMap = new Map();

  for (const row of rawData) {
    const likertValues = [row.Interest, row.Effective, row.Intelligence, row.Writing, row.Meet]
      .filter(v => typeof v === 'number');

    if (likertValues.length === 5) {
      const mean = likertValues.reduce((a, b) => a + b, 0) / 5;
      const variance = likertValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / 5;
      const source = getSource(row['Start Date']);

      if (!participantMap.has(row.ROWID)) {
        participantMap.set(row.ROWID, {
          variance,
          source,
          treatment: row.Treatment
        });
      }
    }
  }

  const participants = Array.from(participantMap.values());

  // Group by source and create histogram bins
  const binSize = 0.5;

  const sourceGroups = { Amazon: [], XLab: [] };

  for (const p of participants) {
    const bin = Math.floor(p.variance / binSize) * binSize;
    sourceGroups[p.source].push({ bin, variance: p.variance });
  }

  // Create density data
  const densityData = [];
  for (const source of ['Amazon', 'XLab']) {
    const values = sourceGroups[source];
    const binCounts = {};
    for (const v of values) {
      const bin = Math.floor(v.variance / binSize) * binSize;
      binCounts[bin] = (binCounts[bin] || 0) + 1;
    }

    for (const [bin, count] of Object.entries(binCounts)) {
      densityData.push({
        source,
        variance: parseFloat(bin),
        count,
        density: count / values.length,
      });
    }
  }

  // Also calculate uniform response counts (variance = 0)
  const uniformCounts = { Amazon: {}, XLab: {} };
  const responseMap = new Map();

  for (const row of rawData) {
    const key = `${row.ROWID}`;
    const source = getSource(row['Start Date']);

    if (!responseMap.has(key)) {
      responseMap.set(key, { total: 0, uniform: 0, source });
    }

    const p = responseMap.get(key);
    p.total++;

    const likertValues = [row.Interest, row.Effective, row.Intelligence, row.Writing, row.Meet];
    const allSame = likertValues.every(v => v === likertValues[0]);
    if (allSame) {
      p.uniform++;
    }
  }

  // Count uniform response distributions
  for (const [_, data] of responseMap) {
    const uCount = data.uniform;
    uniformCounts[data.source][uCount] = (uniformCounts[data.source][uCount] || 0) + 1;
  }

  const uniformData = [];
  for (const source of ['Amazon', 'XLab']) {
    for (const [uniformResponses, count] of Object.entries(uniformCounts[source])) {
      uniformData.push({
        source,
        uniformResponses: parseInt(uniformResponses),
        count,
      });
    }
  }

  return {
    density: densityData.sort((a, b) => a.variance - b.variance),
    uniform: uniformData.sort((a, b) => a.uniformResponses - b.uniformResponses),
  };
}

// 4. Generate WPM (words per minute) data
function generateWpmData() {
  const wpmBySource = { Amazon: [], XLab: [] };

  for (const row of rawData) {
    const source = getSource(row['Start Date']);
    const wpm = row.wpm;

    if (typeof wpm === 'number' && wpm > 0 && wpm < 5000) { // Filter outliers
      wpmBySource[source].push({
        wpm,
        treatment: row.Treatment,
      });
    }
  }

  // Create histogram data
  const binSize = 50;
  const histogramData = [];

  for (const source of ['Amazon', 'XLab']) {
    const binCounts = {};
    for (const item of wpmBySource[source]) {
      const bin = Math.floor(item.wpm / binSize) * binSize;
      binCounts[bin] = (binCounts[bin] || 0) + 1;
    }

    for (const [bin, count] of Object.entries(binCounts)) {
      histogramData.push({
        source,
        wpmBin: parseInt(bin),
        count,
      });
    }
  }

  // Calculate summary stats by treatment
  const statsByTreatment = {};
  for (const treatment of ['Control', 'Typographical', 'Phonological']) {
    const values = rawData
      .filter(r => r.Treatment === treatment && typeof r.wpm === 'number' && r.wpm > 0 && r.wpm < 5000)
      .map(r => r.wpm);

    if (values.length > 0) {
      values.sort((a, b) => a - b);
      statsByTreatment[treatment] = {
        mean: values.reduce((a, b) => a + b, 0) / values.length,
        median: values[Math.floor(values.length / 2)],
        min: values[0],
        max: values[values.length - 1],
        count: values.length,
      };
    }
  }

  return {
    histogram: histogramData.sort((a, b) => a.wpmBin - b.wpmBin),
    statsByTreatment,
  };
}

// Generate all data files
console.log('Generating demographic data...');
const demographicData = generateDemographicData();
fs.writeFileSync(
  path.join(dataDir, 'demographics.json'),
  JSON.stringify(demographicData, null, 2)
);
console.log('  Created demographics.json');

console.log('Generating divergence data...');
const divergenceData = generateDivergenceData();
fs.writeFileSync(
  path.join(dataDir, 'divergence.json'),
  JSON.stringify(divergenceData, null, 2)
);
console.log('  Created divergence.json');

console.log('Generating Likert variance data...');
const likertVarianceData = generateLikertVarianceData();
fs.writeFileSync(
  path.join(dataDir, 'likert-variance.json'),
  JSON.stringify(likertVarianceData, null, 2)
);
console.log('  Created likert-variance.json');

console.log('Generating WPM data...');
const wpmData = generateWpmData();
fs.writeFileSync(
  path.join(dataDir, 'wpm.json'),
  JSON.stringify(wpmData, null, 2)
);
console.log('  Created wpm.json');

console.log('\nAll data files generated successfully!');
