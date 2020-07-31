const createScheduler = require("probot-scheduler");

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = (robot) => {
  // Your code here

  createScheduler(robot, {
    interval: 30000,
  });
  robot.on("schedule.repository", (context) => {
    const repo = context.payload.repository.name;
    const owner = context.payload.repository.owner.login;
    // master
    const default_branch = context.payload.repository.default_branch;
    const fork = context.payload.repository.fork;
    const private = context.payload.repository.private;

    let files = [];

    // console.log("REPO: ", repo, "OWNER: ", owner);

    // Get sha from the default branch and run get files
    // context.github.repos
    //   .getBranch({
    //     owner,
    //     repo,
    //     branch: default_branch,
    //   })
    //   .then((result) => {
    //     const sha = result.data.commit.sha;

    //     getfiles(sha);
    //   });

    // const addPathToArray = (path) => {
    //   files.push(path);
    // };

    // Get files
    // const getfiles = (sha) => {
    //   context.github.git
    //     .getTree({
    //       owner,
    //       repo,
    //       tree_sha: sha,
    //     })
    //     .then((tree) => {
    //       tree.data.tree.map((branch) => {
    //         const { path, type, sha } = branch;
    //         if (type === "blob" && path.includes('.js')) {
    //           addPathToArray(path);
    //         }
    //         if (type === "tree") {
    //           getfiles(sha);
    //         }
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("ERROR: ", error);
    //     })
    //     .finally(() => {
    //       console.log("FILES: ", files);
    //     });
    // };

    // Get the package.json and console the react version
    // context.github.repos
    //   .getContents({
    //     owner,
    //     repo,
    //     path: "package.json",
    //   })
    //   .then((result) => {
    //     // content will be base64 encoded
    //     const content = Buffer.from(result.data.content, "base64").toString();

    //     const removeQuotes = content.replace(/"/g, "");
    //     const reactVersion = removeQuotes
    //       .split("\n")
    //       .filter((item) => item.includes("react:"))
    //       .map((item) => item.trim());

    //     console.log(reactVersion);
    //   });

    // Workflow
    // 1. does repo have package.json ?
    if (!fork && !private) {
      // console.log(repo);
      context.github.repos
        .getContents({
          owner,
          repo,
          path: "package.json",
        })
        .then((result) => {
          console.log(result && "YES", repo);
        }).catch((error) => {
          console.log("NO Package.json", repo);
        });
    }
    // 2. does package.json have react ? react version
    // 3. look for files (js,jsx) don't look in folder like (public,test) - list of filename
    // 4. loop over files and look and the contents of the the file.
  });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
