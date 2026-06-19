<div align="center">

# 🔌 KODI WebsocketServer (Template B)

**Lightweight realtime pub/sub relay — the transport layer for chat in the KODI / Template B city app.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![ws](https://img.shields.io/badge/ws-WebSocket-444444?style=flat-square)](https://github.com/websockets/ws)
[![License](https://img.shields.io/badge/License-EUPL%201.2-green?style=flat-square)](LICENSE)

_Template B realtime server — open-sourced from **KODI-Kommunen-Digital**. Licensed under the [EUPL-1.2](LICENSE)._

</div>

---

## Overview

A small WebSocket + HTTP relay that fans out messages to subscribed clients. It is the realtime transport behind the forum/chat service — one of three backend services:

| Service | Role |
|---|---|
| `kodi-backend-template-B` | Main REST API — listings, services, events, auth |
| `kodi-backend-forum-template-B` | Forums, groups, and chat (publishes chat messages here) |
| **`kodi-websocket-server-template-B`** *(this repo)* | Realtime pub/sub transport for chat messages |

---

## How it works

- **WebSocket** (`ws://…/ws`) — a client connects and sends a `subscribe` message with a `channelId`; the server tracks the connection per channel (in-memory) and keeps it alive with a ping/timeout check.
- **HTTP** (`POST /publish/:channelId`) — the request body is broadcast to every client subscribed to that channel. The forum service calls this to deliver chat messages.
- **Auth** — requests are gated by `ACCESS_TOKEN`.
- **Health** — `GET /` returns a liveness message.

Subscriptions are held in memory (`subscriptions.js`) — this is a stateless relay, not a message store.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| HTTP | Express |
| WebSocket | `ws` |
| Config | `dotenv` |

---

## Getting Started

### Prerequisites

- Node.js **18+**

### Installation

```bash
git clone https://github.com/Kodi-Entwicklergemeinschaft/kodi-websocket-server-template-B.git
cd kodi-websocket-server-template-B
npm install
```

### Configuration

```bash
cp .env.example .env
```

| Key | Description |
|---|---|
| `PORT` | Port the server listens on (required) |
| `ACCESS_TOKEN` | Shared token used to authorise publish/subscribe |

> `.env` is gitignored — never commit real credentials.

### Run

```bash
npm start        # nodemon index.js
```

---

## Related Services

- **Forum service:** [`kodi-backend-forum-template-B`](https://github.com/Kodi-Entwicklergemeinschaft/kodi-backend-forum-template-B)
- **Main API:** [`kodi-backend-template-B`](https://github.com/Kodi-Entwicklergemeinschaft/kodi-backend-template-B)

---

## License

Licensed under the **European Union Public Licence v1.2 (EUPL-1.2)**. See [LICENSE](LICENSE).
