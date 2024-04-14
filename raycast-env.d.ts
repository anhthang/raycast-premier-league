/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Search bar filter - Choose your preffered filter in the search bar for Fixtures & Results */
  "filter": "competition" | "club"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `table` command */
  export type Table = ExtensionPreferences & {}
  /** Preferences accessible in the `fixture` command */
  export type Fixture = ExtensionPreferences & {}
  /** Preferences accessible in the `result` command */
  export type Result = ExtensionPreferences & {}
  /** Preferences accessible in the `player` command */
  export type Player = ExtensionPreferences & {}
  /** Preferences accessible in the `manager` command */
  export type Manager = ExtensionPreferences & {}
  /** Preferences accessible in the `club` command */
  export type Club = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `table` command */
  export type Table = {}
  /** Arguments passed to the `fixture` command */
  export type Fixture = {}
  /** Arguments passed to the `result` command */
  export type Result = {}
  /** Arguments passed to the `player` command */
  export type Player = {}
  /** Arguments passed to the `manager` command */
  export type Manager = {}
  /** Arguments passed to the `club` command */
  export type Club = {}
}

