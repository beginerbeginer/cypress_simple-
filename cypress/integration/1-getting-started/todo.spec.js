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
      // 上で使ったコマンドで、ある要素をチェックオフしてみる
      // 1つの要素をチェックすることから始まるテストを複数回行いたいので、
      // 各テストの開始時に実行されるように beforeEach フックに記述します。
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
    })

    it('can filter for uncompleted tasks', () => {
      // 「アクティブ」ボタンをクリックするのは
      // 未完成の項目のみを表示する
      cy.contains('Active').click()

      // フィルタリングの後、1つだけであることを主張することができます。
      // リスト内の不完全な項目。
      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Walk the dog')

      // 念のため、チェックオフしたタスクがあることも断言しておこう。
      // ページ上に存在しない。
      cy.contains('Pay electric bill').should('not.exist')
    })

    it('can filter for completed tasks', () => {
      // 上記のテストと同様の手順で、以下のことを確認できます。
      // 完了したタスクのみが表示されるようにする
      cy.contains('Completed').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pay electric bill')

      cy.contains('Walk the dog').should('not.exist')
    })

    it('can delete all completed tasks', () => {
      // まず、「クリア完了」ボタンをクリックしよう
      // `contains` は、実際にはここで2つの目的を果たしています。
      // まず、このボタンが dom の中に存在することを確認します。
      // このボタンは、少なくとも1つのタスクがチェックされたときにのみ表示されます。
      // したがって、このコマンドは暗黙のうちにそれが存在することを検証している。
      // 第二に、ボタンを選択し、クリックできるようにします。
      cy.contains('Clear completed').click()

      // そして、要素が1つだけであることを確認することができます。
      // リスト内に存在し、我々の要素は存在しない
      cy.get('.todo-list li')
        .should('have.length', 1)
        .should('not.have.text', 'Pay electric bill')

      // 最後に、クリアボタンがもう存在しないことを確認する。
      cy.contains('Clear completed').should('not.exist')
    })
  })
})
