import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const postsDir = path.join(root, 'src', 'content', 'blog', 'posts');

const aliasMap = new Map([
  ['aiinmedicine', 'ai-in-medicine'],
  ['aiinhealthcare', 'ai-in-healthcare'],
  ['aiagents', 'ai-agents'],
  ['airevolution', 'ai-revolution'],
  ['ambientai', 'ambient-ai'],
  ['artificialintelligence', 'artificial-intelligence'],
  ['automatedbilling', 'automated-billing'],
  ['clinicalai', 'clinical-ai'],
  ['clinicalinformatics', 'clinical-informatics'],
  ['clinicaldecisionsupport', 'clinical-decision-support'],
  ['clinicaldecisionsupport-2', 'clinical-decision-support'],
  ['clinicaldocumentation', 'clinical-documentation'],
  ['clinicalsoftware', 'clinical-software'],
  ['clinicalworkflow', 'clinical-workflow'],
  ['clinicianburnout', 'clinician-burnout'],
  ['codecraftmd-2', 'codecraftmd'],
  ['cptcoding', 'cpt-coding'],
  ['datascience', 'data-science'],
  ['digitalhealth', 'digital-health'],
  ['digitalhealth-2', 'digital-health'],
  ['doctorswhocode', 'doctors-who-code'],
  ['doctorswhocode-2', 'doctors-who-code'],
  ['emrintegration', 'emr-integration'],
  ['ethicsinai', 'ethics-in-ai'],
  ['evidencemd', 'evidence-md'],
  ['faithandtechnology', 'faith-and-technology'],
  ['healthcareaccess', 'healthcare-access'],
  ['halfmarathontraining', 'half-marathon-training'],
  ['healthcareai', 'ai-in-healthcare'],
  ['healthcareai-2', 'ai-in-healthcare'],
  ['healthcareautomation', 'healthcare-automation'],
  ['healthcareautomation-2', 'healthcare-automation'],
  ['healthcareinnovation', 'healthcare-innovation'],
  ['healthcareinnovation-2', 'healthcare-innovation'],
  ['healthcarepolicy', 'healthcare-policy'],
  ['healthpolicy', 'healthcare-policy'],
  ['healthit', 'health-it'],
  ['healthit-2', 'health-it'],
  ['healthtech', 'health-tech'],
  ['healthtech-2', 'health-tech'],
  ['healthequity', 'health-equity'],
  ['highriskob', 'high-risk-pregnancy'],
  ['futureofmedicine', 'future-of-medicine'],
  ['fhirintegration', 'fhir-integration'],
  ['jevonsparadox', 'jevons-paradox'],
  ['learningbydoing', 'learning-by-doing'],
  ['llmcoding', 'llm-coding'],
  ['linearalgebra', 'linear-algebra'],
  ['medicaidcuts', 'medicaid-cuts'],
  ['maternalfetalmedicine', 'maternal-fetal-medicine'],
  ['maternalfetalmedicine-2', 'maternal-fetal-medicine'],
  ['mfm-2', 'mfm'],
  ['medicalai', 'medical-ai'],
  ['medicalai-2', 'medical-ai'],
  ['medicalbilling', 'medical-billing'],
  ['medicalcoding', 'medical-coding'],
  ['medicalinformatics', 'medical-informatics'],
  ['medicalinnovation', 'medical-innovation'],
  ['medicalproductivity', 'medical-productivity'],
  ['medicaltechnology', 'medical-technology'],
  ['machinelearning', 'machine-learning'],
  ['mathbehindai', 'math-behind-ai'],
  ['nextjs', 'next-js'],
  ['openmfm', 'openmfm'],
  ['opensourcehealthcare', 'open-source-healthcare'],
  ['patternrecognition', 'pattern-recognition'],
  ['physiciandeveloper', 'physician-developer'],
  ['physician-developers', 'physician-developer'],
  ['physician-developer-2', 'physician-developer'],
  ['physiciandevelopers', 'physician-developer'],
  ['physiciandevelopers-2', 'physician-developer'],
  ['physicianproductivity', 'physician-productivity'],
  ['physicianwellness', 'physician-wellness'],
  ['pointofcareultrasound', 'point-of-care-ultrasound'],
  ['precisionmedicine', 'precision-medicine'],
  ['priorauthorization', 'prior-authorization'],
  ['pwic', 'protocol-to-website'],
  ['railway', 'railway'],
  ['readinginpublic', 'reading-in-public'],
  ['reinforcementlearning', 'reinforcement-learning'],
  ['remotepatientmonitoring', 'remote-patient-monitoring'],
  ['reduceburnout', 'physician-burnout'],
  ['revenueintegrity', 'revenue-integrity'],
  ['ruralhealthcare', 'rural-healthcare'],
  ['ruralmedicine', 'rural-medicine'],
  ['smarthealthcare', 'smart-healthcare'],
  ['supervisedlearning', 'supervised-learning'],
  ['techinmedicine', 'tech-in-medicine'],
  ['techandsociety', 'tech-and-society'],
  ['type2diabetes', 'type-2-diabetes'],
  ['unsupervisedlearning', 'unsupervised-learning'],
  ['valuebasedcare', 'value-based-care'],
  ['whymachineslearn', 'why-machines-learn'],
]);

function slugifyTag(tag) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeTag(tag) {
  const slug = slugifyTag(tag);
  return aliasMap.get(slug) ?? slug;
}

function normalizeTagsBlock(block) {
  const tags = [];

  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^\s*-\s*(.+)$/);
    if (!match) {
      continue;
    }

    const raw = match[1].trim().replace(/^['"]+|['"]+$/g, '');
    const normalized = normalizeTag(raw);
    if (!normalized || tags.includes(normalized)) {
      continue;
    }

    tags.push(normalized);
  }

  return tags.map((tag) => `- "${tag}"`).join('\n');
}

let changedFiles = 0;

for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
  if (!entry.isFile()) {
    continue;
  }

  const filePath = path.join(postsDir, entry.name);
  const contents = fs.readFileSync(filePath, 'utf8');
  const updated = contents.replace(
    /(^tags:\s*\r?\n)([\s\S]*?)(?=^[A-Za-z_][A-Za-z0-9_]*:\s|\r?\n---)/m,
    (match, start, block) => {
      const normalizedBlock = normalizeTagsBlock(block);
      return normalizedBlock ? `${start}${normalizedBlock}\n` : match;
    },
  );

  if (updated !== contents) {
    fs.writeFileSync(filePath, updated, 'utf8');
    changedFiles += 1;
  }
}

console.log(`Normalized tags in ${changedFiles} published post files.`);
