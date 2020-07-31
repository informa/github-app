const createScheduler = require("probot-scheduler");

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = (app) => {
  createScheduler(app, {
    interval: 30000,
  });

  app.on("schedule.repository", async (context) => {
    const fork = context.payload.repository.fork;
    const private = context.payload.repository.private;

    // 1. Don't do anything if repo is a fork or private
    if (fork || private) {
      return;
    }

    // Get credentials
    const login = context.payload.repository.owner.login;
    const repoName = context.payload.repository.name;

    // 2. Does repo have package.json
    try {
      const packageJSON = await context.github.request(
        `GET /repos/${login}/${repoName}/contents/package.json`
      );
      const content = Buffer.from(
        packageJSON.data.content,
        "base64"
      ).toString();
      const toJSON = JSON.parse(content);

      // 3. look for react (would normally look for myob-widgets) is installed
      const reactVersion = toJSON.dependencies.react;

      if (!reactVersion) {
        console.log("NO REACT: don't scan", repoName);
        return;
      } else {
        console.log("REACT: ", reactVersion, repoName);
      }
    } catch (e) {
      console.log("NO PACKAGE.json: don't scan", repoName);
      return;
    }

    // 4. As react (myob-widgets) is installed we want to get the files react (myob-widgts) is included
    // First we need to get the Get Branch as to get the sha
    const defaultBranch = context.payload.repository.default_branch;

    const branch = await context.github.request(
      `GET /repos/${login}/${repoName}/branches/${defaultBranch}`
    );

    // Get tree: A Git tree object creates the hierarchy between files in a Git repository
    // https://developer.github.com/v3/git/trees/
    const readRepo = async ({ login, repoName, sha }) =>
      await context.github.request(
        `GET /repos/${login}/${repoName}/git/trees/${sha}`
      );

    const readFiles = (files, path) =>
      files.data.tree.forEach(async (file) => {
        if (file.type === "blob" && file.path.match(/^.*\.(js|jsx|ts)$/)) {
          // 5. If the file (blob) is a js,jsx,ts file then we need to see if if contains react (myob-widgets)
          await context.github.request(
            `GET /repos/${login}/${repoName}/contents/${path.join("/")}/${
              file.path
            }`
          );
          console.log("FILENAME: ", `${path.join("/")}/${file.path}`, repoName);
        }

        // If the file is a directory (tree) then we need to send another request
        // But if the directory is test then don't bother
        if (file.type === "tree" && file.path.indexOf("test") < 0) {
          const filesInTree = await readRepo({
            login,
            repoName,
            sha: file.sha,
          });

          readFiles(filesInTree, path.concat([file.path]));
        }
      });

    readFiles(
      await readRepo({
        login,
        repoName,
        sha: branch.data.commit.sha,
      }),
      []
    );
  });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
