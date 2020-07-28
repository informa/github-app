/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = (app) => {
  // Your code here
  app.log("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    // app.log(
    //   "context",
    //   context.payload.sender.login,
    //   context.payload.repository.name
    // );

    context.github.repos
      .getContents({
        owner: context.payload.sender.login,
        repo: context.payload.repository.name,
        path: "package.json",
      })
      .then((result) => {
        // content will be base64 encoded
        const content = Buffer.from(result.data.content, "base64").toString();

        const removeQuotes = content.replace(/"/g, "");
        const reactVersion = removeQuotes
          .split("\n")
          .filter((item) => item.includes("react:"))
          .map((item) => item.trim());

        console.log(reactVersion);
      });

    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.github.issues.createComment(issueComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
