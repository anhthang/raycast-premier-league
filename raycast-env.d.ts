/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Search Bar Filter - Select your preferred filtering method in the search bar for Fixtures & Results. */
  "filter": "competition" | "club"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `table` command */
  export type Table = ExtensionPreferences & {}
  /** Preferences accessible in the `match` command */
  export type Match = ExtensionPreferences & {}
  /** Preferences accessible in the `club` command */
  export type Club = ExtensionPreferences & {}
  /** Preferences accessible in the `player` command */
  export type Player = ExtensionPreferences & {}
  /** Preferences accessible in the `award` command */
  export type Award = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `table` command */
  export type Table = {}
  /** Arguments passed to the `match` command */
  export type Match = {}
  /** Arguments passed to the `club` command */
  export type Club = {}
  /** Arguments passed to the `player` command */
  export type Player = {}
  /** Arguments passed to the `award` command */
  export type Award = {}
}

