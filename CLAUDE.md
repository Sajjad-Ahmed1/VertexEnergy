# Vertex Energy — Project Source of Truth

## Project Overview

**Vertex Energy** is an Industrial SaaS and Digital Twin platform purpose-built for the oil and gas sector. The platform enables real-time monitoring, simulation, and control of industrial assets through digital representations of physical infrastructure — pipelines, refineries, pumping stations, and field equipment.

---

## Core Technology Stack

- **Backend:** C# (.NET) — primary language for all services, APIs, and business logic
- **Frontend:** Modern UI frameworks (Blazor / React with C# interop as applicable)
- **Data Layer:** Time-series and relational databases suitable for industrial telemetry
- **Digital Twin Engine:** Real-time asset mirroring, simulation, and predictive modeling
- **Integration:** OPC-UA, SCADA, IoT edge protocols for field device connectivity

---

## Design & UI Principles

### 1. WCAG Accessibility (Non-Negotiable)
- All UI must conform to **WCAG 2.1 AA** as a minimum; target AAA where feasible
- Every interactive element must be keyboard-navigable and screen-reader compatible
- Color must never be the sole means of conveying information (always pair with icons, labels, or patterns)
- Focus indicators must be clearly visible at all times
- Minimum contrast ratios: **4.5:1** for normal text, **3:1** for large text and UI components

### 2. Industrial Dark Mode
- The default and primary theme is **Industrial Dark** — optimized for control room environments with low ambient light and extended operator sessions
- Base background: deep neutral tones (e.g., `#0D1117` / `#161B22` range)
- Surface layers: subtle elevation using dark grays, never pure black
- Accent colors: high-visibility, desaturated industrial palette — amber alerts, cyan telemetry, green nominal states, red critical alarms
- Avoid pure white text; use off-white (`#E6EDF3` range) to reduce eye strain
- All color tokens must be defined as CSS/design variables to support theme switching

### 3. Data Hierarchy for Control Room Environments
- Information must be structured by **operational criticality**, not alphabetical or arbitrary order
- Visual hierarchy levels:
  1. **Critical Alarms** — immediate operator action required (highest visual weight, red)
  2. **Warnings** — degraded state, attention needed (amber)
  3. **Nominal / Live Telemetry** — real-time operational data (cyan / green)
  4. **Historical / Reference Data** — lower visual prominence (muted tones)
  5. **Configuration / Settings** — least prominent, never competes with live data
- Dense data displays (tables, dashboards) must use consistent alignment, monospace numerics, and clear unit labeling
- Avoid decorative UI elements that add visual noise in operational views

---

## Coding Standards

- All C# code follows Microsoft's official C# coding conventions
- Services are structured following Clean Architecture principles (Domain → Application → Infrastructure → Presentation)
- API contracts use RESTful conventions with OpenAPI/Swagger documentation
- Unit tests are required for all business logic; integration tests for all data pipelines
- No magic numbers or hardcoded strings — use constants, enums, and configuration

---

## Key Domain Concepts

| Term | Definition |
|---|---|
| **Asset** | A physical industrial unit (pump, valve, pipeline segment, tank) |
| **Digital Twin** | A real-time virtual model of an Asset, synchronized with live sensor data |
| **Tag** | A named data point from a sensor or SCADA system (e.g., `PT-101` = pressure transmitter) |
| **Alarm** | A threshold breach or anomaly detected on a Tag or Asset state |
| **Historian** | The time-series store for all Tag readings and event logs |
| **Operator** | The primary end-user role — works in a control room environment |

---

## Non-Functional Requirements

- **Performance:** Dashboard views must render within 2 seconds under full data load
- **Reliability:** Platform targets 99.9% uptime; graceful degradation when field devices disconnect
- **Security:** Role-based access control (RBAC); all data in transit encrypted (TLS 1.2+)
- **Auditability:** All operator actions and configuration changes must be logged with timestamps and user identity

---

## What Claude Should Always Do in This Project

- Prioritize accessibility in every UI decision — no exceptions
- Default to Industrial Dark Mode color tokens; never use bright white backgrounds in operational views
- Structure data output by operational criticality, not convenience
- Write idiomatic C# — prefer expressiveness and correctness over cleverness
- Flag any design or code decision that could impair operator situational awareness
