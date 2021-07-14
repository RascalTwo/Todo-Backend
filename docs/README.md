[frontend]: ../../../../Todo-Frontend
[fullstack]: ../../../../Todo-Fullstack
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[WebSockets]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
[graph]: ./graph.svg?raw=1
[graph-full]: ./graph-full.svg?raw=1
[sequelize options]: https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
[sequelize]: https://github.com/sequelize/sequelize/

# Todo Backend

![visitors](https://visitor-badge.glitch.me/badge?page_id=RascalTwo.Todo-Backend)
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/RascalTwo/Todo-Backend)
![GitHub package.json version](https://img.shields.io/github/package-json/v/RascalTwo/Todo-Backend)

<details>
  <summary>Statistics</summary>

  ![GitHub language count](https://img.shields.io/github/languages/count/RascalTwo/Todo-Backend)
  ![GitHub top language](https://img.shields.io/github/languages/top/RascalTwo/Todo-Backend)
  ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/RascalTwo/Todo-Backend)
  ![Lines of code](https://img.shields.io/tokei/lines/github/RascalTwo/Todo-Backend)
</details>

<details>
  <summary>Repository</summary>

  ![GitHub issues](https://img.shields.io/github/issues/RascalTwo/Todo-Backend)
  ![GitHub closed issues](https://img.shields.io/github/issues-closed/RascalTwo/Todo-Backend)
  ![GitHub pull requests](https://img.shields.io/github/issues-pr/RascalTwo/Todo-Backend)
  ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/RascalTwo/Todo-Backend)
  ![GitHub last commit](https://img.shields.io/github/last-commit/RascalTwo/Todo-Backend)
</details>

> Primary

<code><a href="../tsconfig.json"><img alt="TypeScript" title="TypeScript" src="https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png" width="50" /></a></code>
<code><img alt="Express" title="Express" src="https://expressjs.com/images/favicon.png" width="50" /></code>
<code><img alt="Sequelize" title="Sequelize" src="https://sequelize.org/master/manual/asset/logo-small.png" width="50" /></code>

> Secondary

<code><img alt="JavaScript" title="JavaScript" src="https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png" width="50" /></code>
<code><img alt="JSON" title="JSON" src="https://raw.githubusercontent.com/github/explore/main/topics/json/json.png" width="50" /></code>

> Tooling

<code><img alt="Git" title="Git" src="https://raw.githubusercontent.com/github/explore/main/topics/git/git.png" width="50" /></code>
<code><a href="../package.json"><img alt="Yarn" title="Yarn" src="https://avatars.githubusercontent.com/u/22247014" width="50" /></a></code>
<code><a href="../Dockerfile.dev"><img alt="Docker" title="Docker" src="https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png" width="50" /></a></code>
<code><img alt="GitHub" title="GitHub" src="https://raw.githubusercontent.com/github/explore/main/topics/github/github.png" width="50" /></code>

TypeScript + Express + Sequelize to support the [![Todo Frontend package.json version](https://img.shields.io/github/package-json/v/RascalTwo/Todo-Frontend?label=Todo%20Frontend)][frontend].

Full deployment/development with the [Frontend][frontend] can be achieved by using the [Todo Fullstack][fullstack] repository.

## Features

Both a REST and [WebSockets] API to handle creating, retrivig, update, and delete Todo items.

In addition, these Todo items are seperated by List code.

## Environment Variables

| Variable            | Default Value    | Description |
| -                   | -                | -           |
| `PORT`              | `5000`           | Port to run server on |
| `SEQUELIZE_OPTIONS` | `5000`           | Port to run server on |
| `STATIC_DIRECTORY`  | `{"dialect":"sqlite","storage":"./database.db"}` | [`sequelize`][sequelize] connection [options][sequelize options] |
| `NODE_ENV`          | `"production"`   | Changes various [behaviors](#node_env) |
| `CORS_ORIGIN`       | `false`          | [`cors`](https://github.com/expressjs/cors) [`origin`](https://github.com/expressjs/cors#configuration-options) value |
| `SESSION_SECRET`    | `"cat keyboard"` | [`express-session`](https://github.com/expressjs/session) [`secret`](https://github.com/expressjs/session#secret) value |
| `CSRF_SECRET`       | `"csrf secret"`  | SHA256 [secret key](https://nodejs.org/api/crypto.html#crypto_crypto_createhmac_algorithm_key_options) |

### `NODE_ENV`

[morgan]: https://github.com/expressjs/morgan

- `production`
  - [`morgan`][morgan] logging style set to [`combined`](https://github.com/expressjs/morgan#combined)
  - Disable [`sequelize`][sequelize] [`logging`][sequelize options]
- `development`/`testing`
  - [`morgan`][morgan] logging style set to [`dev`](https://github.com/expressjs/morgan#dev)
  - Enable [`sequelize`][sequelize] [`logging`][sequelize options]

## Structure

> Click for interactive versions

<details>
  <summary>Local Files</summary>

  [![][graph]][graph]
</details>

<details>
  <summary>Everything</summary>

  [![][graph-full]][graph-full]
</details>
