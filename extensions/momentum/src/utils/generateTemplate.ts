import bars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { TemplatePath } from '../typing/autoGenerated';
import { templatesRoot } from '../consts';

export interface EslintTemplateData {
  extends: string[];
  plugins: string[];
  parser?: string;
}

const loadRawTemplate = async (template: TemplatePath): Promise<string> => {
  return fs.readFile(path.join(templatesRoot, `${template}.template`), { encoding: 'utf-8' });
};


export const generateTemplate = async (relativePath: TemplatePath, savePath: string, data: object) => {
  const template = await loadRawTemplate(relativePath);
  const compiledTemplate = bars.compile(template)(data);
  const templateName = relativePath.split('/').pop()!;
  return fs.writeFile(path.join(savePath, templateName), compiledTemplate, { encoding: 'utf-8' });
};

export const generateEslintTemplate = async (savePath: string, data: EslintTemplateData) => {
  return generateTemplate('/node/.eslintrc.js', savePath, data);
};
