/// <reference types="cypress" />

// サイプレスへようこそ
// この spec ファイルには、Todo リスト アプリのさまざまなサンプル テストが含まれており、Cypress でテストを記述することの威力を示すように設計されています。

// Cypress の仕組みやテストツールの魅力についてもっと知りたい方は、スタートガイドをご覧ください： https://on.cypress.io/introduction-to-cypress

describe('example to-do app', () => {
  beforeEach(() => {
    // Cypressはテストごとに白紙の状態からスタートするので、 `cy.visit()` コマンドで私たちのウェブサイトを訪問するように指示しなければなりません。
    // すべてのテストの開始時に同じURLにアクセスしたいので、`cy.visit()'コマンドを使用します。
    // 各テストの前に実行されるように、beforeEach関数にこの関数を含めます。
    cy.visit('https://example.cypress.io/todo')
  })

  it('displays two todo items by default', () => {
    // セレクタにマッチするすべての要素を取得するために `cy.get()` コマンドを使用します。
    // 次に、`should` を使って、マッチした項目が2つあることを主張します。
    // これはデフォルトの2つの項目です。
    cy.get('.todo-list li').should('have.length', 2)

    // さらに進んで、デフォルトのTODOがそれぞれ正しいテキストを含んでいるかどうかをチェックすることができます。
    // first` と `last` 関数を使用して、マッチした最初と最後の要素だけを個別に取得します。
    // そして `should` でアサーションを実行します。
    cy.get('.todo-list li').first().should('have.text', 'Pay electric bill')
    cy.get('.todo-list li').last().should('have.text', 'Walk the dog')
  })

  it('can add new todo items', () => {
    // アイテムテキストを再利用できるように変数に格納します
    const newItem = 'Feed the cat'

    // input 要素を取得して、 `type` コマンドを使って新しいリストアイテムを入力してみましょう。アイテムの内容を入力した後、`type`コマンドを使用します。
    // 入力内容を送信するために、Enterキーも入力する必要があります。
    // この入力は data-test 属性を持っているので、ベストプラクティスに従ってそれを使って要素を選択することにします。https://on.cypress.io/selecting-elements
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)

    // 新しい項目を入力したので、それが実際にリストに追加されたことを確認しましょう。
    // これは最も新しいアイテムなので、リストの最後の要素として存在するはずです。
    // さらに、2 つのデフォルトのアイテムがあるので、リストには合計 3 つの要素があるはずです。
    // アサーションはアサーションされた要素を返すので これらのアサーションは、1つのステートメントにまとめることができます。
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
  })

  it('can check off an item as completed', () => {
    // `get`コマンドを使用してセレクターで要素を取得することに加えて、` contains`コマンドを使用してその内容で要素を取得することもできます。
    // ただし、これにより、テキストを含む最下位レベルの要素である<label>が生成されます。
    // アイテムをチェックするために、domを親要素までトラバースすることにより、この<label>の<input>要素を見つけます。
    // そこから、子チェックボックス<input>要素を「検索」し、「check」コマンドを使用してチェックできます。
    cy.contains('Pay electric bill')
      .parent()
      .find('input[type=checkbox]')
      .check()

    // ボタンをチェックしたので、先に進んで確認することができます
    // リスト要素が完了としてマークされていること。
    // ここでも、 `contains`を使用して<label>要素を検索し、次に` parents`コマンドを使用して、対応する<li>要素が見つかるまでdomの複数のレベルをトラバースします。
    // その要素を取得したら、その要素に完了したクラスがあることを表明できます。
    cy.contains('Pay electric bill')
      .parents('li')
      .should('have.class', 'completed')
  })

  context('with a checked task', () => {
    beforeEach(() => {
      // We'll take the command we used above to check off an element
      // Since we want to perform multiple tests that start with checking
      // one element, we put it in the beforeEach hook
      // so that it runs at the start of every test.
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
    })

    it('can filter for uncompleted tasks', () => {
      // We'll click on the "active" button in order to
      // display only incomplete items
      cy.contains('Active').click()

      // After filtering, we can assert that there is only the one
      // incomplete item in the list.
      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Walk the dog')

      // For good measure, let's also assert that the task we checked off
      // does not exist on the page.
      cy.contains('Pay electric bill').should('not.exist')
    })

    it('can filter for completed tasks', () => {
      // We can perform similar steps as the test above to ensure
      // that only completed tasks are shown
      cy.contains('Completed').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pay electric bill')

      cy.contains('Walk the dog').should('not.exist')
    })

    it('can delete all completed tasks', () => {
      // First, let's click the "Clear completed" button
      // `contains` is actually serving two purposes here.
      // First, it's ensuring that the button exists within the dom.
      // This button only appears when at least one task is checked
      // so this command is implicitly verifying that it does exist.
      // Second, it selects the button so we can click it.
      cy.contains('Clear completed').click()

      // Then we can make sure that there is only one element
      // in the list and our element does not exist
      cy.get('.todo-list li')
        .should('have.length', 1)
        .should('not.have.text', 'Pay electric bill')

      // Finally, make sure that the clear button no longer exists.
      cy.contains('Clear completed').should('not.exist')
    })
  })
})
