/// <reference types="cypress" />
// ***********************************************************
// この例では plugins/index.js を使ってプラグインをロードすることができます。
// 'pluginsFile'設定オプションで、このファイルの場所を変更したり、プラグインファイルの読み込みをオフにすることができます。

// 詳しくはこちらをご覧ください。
// https://on.cypress.io/plugins-guide
// ***********************************************************

// この関数は、プロジェクトが開かれたとき、または開き直されたとき（例えば、次のような理由で）に呼び出されます。
// プロジェクトのコンフィグが変更された場合）

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` は、Cypress が発する様々なイベントにフックするために使用されます。
  // `config` は解決された Cypress の設定です。
}
