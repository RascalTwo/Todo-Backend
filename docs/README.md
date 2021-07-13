[frontend]: ../../../../Todo-Frontend
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[WebSockets]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
[graph]: ./graph.svg?raw=1
[graph-full]: ./graph-full.svg?raw=1
[sequelize options]: https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
[sequelize]: https://github.com/sequelize/sequelize/

# Todo Backend

TypeScript + Express + Sequelize to support the [Todo Frontend][frontend].

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
