const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;

/**
 * 生成 feeds 配置
 * @param {*} name
 * @param {*} uri
 * @param {*} branch
 * @returns
 */
const GenerateFeedsConfig = (name, uri, branch) => {
  exec(`git clone --depth=1 ${uri} -b ${branch} ${name}`);
  const revision = exec(`cd ${name} && git log -1 --pretty=%H`).toString().trim();
  exec(`cd ..`);
  exec(`rm -rf ${name}`);
  return {
    name: name.trim(),
    uri: uri.trim(),
    branch: branch.trim(),
    revision: revision.trim(),
  };
}

/**
 * 生成编译配置文件
 */
const generateYml =() => {
  try {
    exec(`npm install js-yaml`);
    const yaml = require('js-yaml');
    // 生成 feeds 配置
    const feeds = require('./feeds').map(item => GenerateFeedsConfig(item.name, item.uri, item.branch));
    // 生成 packages 配置
    const package = require('./packages');
    const packages = package.map(item => item.name.trim());
    const packagesDesc = package.map((item, index) => `${index + 1}. ${item.desc.trim()}`);

    const profilesPath = path.resolve(process.cwd(), `custom.yml`);

    let customYml = yaml.load(fs.readFileSync(profilesPath, 'utf8'));

    const yamlStr = yaml.dump({
      feeds,
      packages,
      customYml: customYml.diffconfig
    }, { lineWidth: -1 });

    fs.writeFileSync(profilesPath, yamlStr);

    // 读取 workflow 模板
    let template = fs.readFileSync(path.resolve(__dirname, 'workflow.tpl'), 'utf8');

    // 写入 workflow
    const workflowsPath = path.resolve(process.cwd(), '.github/workflows', `build-glinet.yml`);
    template = template.replace(/\$\{releasePackages\}/g, JSON.stringify([
      `## ✨ 主要功能`,
      ...packagesDesc
    ].join('\n')));
    fs.writeFileSync(workflowsPath, template)
  } catch (error) {
    throw error;
  } finally {
     // 清理文件
     exec(`rm -rf gl-infra-builder`);
     require('./feeds').forEach(item => exec(`rm -rf ${item.name}`));
     exec(`rm -rf node_modules`);
     exec(`rm -rf package-lock.json`);
     exec(`rm -rf package.json`);
  }
}

generateYml()