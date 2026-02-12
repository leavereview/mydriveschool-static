import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'fs/promises';
import { join, basename } from 'path';

const SCREENSHOTS_DIR = new URL('../screenshots/', import.meta.url).pathname;
const OUTPUT_DIR = new URL('../public/images/marketing/', import.meta.url).pathname;
const MANIFEST_PATH = new URL('../src/data/marketing-images.json', import.meta.url).pathname;

const MOBILE_FILES = new Set([
  'portal-dashboard-mobile',
  'portal-progress-mobile',
  'calendar-mobile'
]);

const ALT_TEXT = {
  'dashboard-overview': 'MyDriveSchool dashboard showing business metrics, today\'s lessons, compliance alerts, and quick action buttons',
  'calendar-week-view': 'Interactive weekly calendar with colour-coded lessons across multiple instructors and drag-and-drop scheduling',
  'student-list': 'Student management page with search, status filters, and paginated student records',
  'lesson-booking-form': 'Lesson booking form showing student, instructor, and vehicle selection with date and time picker',
  'dvsa-progress-tracking': 'DVSA competency tracking grid showing 17 skill categories with proficiency levels from Not Started to Test Ready',
  'calendar-drag-drop': 'Drag-and-drop lesson rescheduling on the weekly calendar view',
  'portal-dashboard-mobile': 'Student self-service portal on mobile showing upcoming lesson, progress summary, and active packages',
  'payments': 'Professional invoice with itemised charges, VAT breakdown, and email delivery status',
  'vehicle-compliance': 'Vehicle fleet list showing MOT, tax, and insurance compliance status with colour-coded alerts',
  'reports-financial': 'Financial reports dashboard with 6-month revenue chart and key business metrics',
  'settings-hours': 'Operating hours configuration showing customisable daily schedules and blackout dates',
  'instructor-availability': 'Instructor weekly availability editor with time block templates and pending time-off requests',
  'portal-progress-mobile': 'Student progress view on mobile showing DVSA competency levels by category',
  'calendar-mobile': 'Daily calendar view on mobile showing scheduled lessons with instructor and vehicle details'
};

async function optimise() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(SCREENSHOTS_DIR)).filter(f => f.endsWith('.png'));
  const manifest = [];
  const results = [];

  for (const file of files) {
    const inputPath = join(SCREENSHOTS_DIR, file);
    // Strip numeric prefix: "01-dashboard-overview.png" -> "dashboard-overview"
    const slug = basename(file, '.png').replace(/^\d+-/, '');
    const outputName = `${slug}.webp`;
    const outputPath = join(OUTPUT_DIR, outputName);

    const isMobile = MOBILE_FILES.has(slug);
    const maxWidth = isMobile ? 750 : 1440;

    const inputMeta = await sharp(inputPath).metadata();
    const inputSize = (await sharp(inputPath).toBuffer()).length;

    const output = await sharp(inputPath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outputPath);

    manifest.push({
      src: `/images/marketing/${outputName}`,
      width: output.width,
      height: output.height,
      alt: ALT_TEXT[slug] || slug,
      mobile: isMobile
    });

    results.push({
      file: outputName,
      inputSize: (inputSize / 1024).toFixed(0) + 'KB',
      outputSize: (output.size / 1024).toFixed(0) + 'KB',
      dimensions: `${output.width}x${output.height}`,
      reduction: ((1 - output.size / inputSize) * 100).toFixed(0) + '%'
    });
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  // Print summary
  console.log('\nOptimisation Results:');
  console.log('─'.repeat(80));
  console.log(
    'File'.padEnd(35),
    'Input'.padEnd(10),
    'Output'.padEnd(10),
    'Dimensions'.padEnd(15),
    'Saved'
  );
  console.log('─'.repeat(80));
  for (const r of results) {
    console.log(
      r.file.padEnd(35),
      r.inputSize.padEnd(10),
      r.outputSize.padEnd(10),
      r.dimensions.padEnd(15),
      r.reduction
    );
  }
  console.log('─'.repeat(80));

  const totalInput = results.reduce((s, r) => s + parseInt(r.inputSize), 0);
  const totalOutput = results.reduce((s, r) => s + parseInt(r.outputSize), 0);
  console.log(`Total: ${totalInput}KB -> ${totalOutput}KB (${((1 - totalOutput / totalInput) * 100).toFixed(0)}% reduction)`);
  console.log(`\nManifest written to: ${MANIFEST_PATH}`);
  console.log(`${manifest.length} images optimised to: ${OUTPUT_DIR}`);
}

optimise().catch(console.error);
