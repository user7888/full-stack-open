describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')

    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)
  })

  it('Login form is shown', function() {
    cy.contains('login to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      // cy.get('#username').type('mluukkai')
      // cy.get('#password').type('salainen')
      cy.get('button').click()
      cy.contains('Matti Luukkainen logged in')
    })


    it('fails with wrong credentials', function() {
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('vaara')
      // cy.get('#username').type('mluukkai')
      // cy.get('#password').type('salainen')
      cy.get('button').click()
      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      // cy.get('#username').type('mluukkai')
      // cy.get('#password').type('salainen')
      cy.get('button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.com')
      // Cypress suggests to use #create instead of 'create'.
      // In material, 'create' is used. Whats going on?
      cy.get('#create').click()

    })

    it('A blog can be liked', function() {
      cy.contains('create new').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.com')
      cy.get('#create').click()
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('Likes 1')
    })

    it('A blog can be deleted by the user who added it', function() {
      cy.contains('create new').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.com')
      cy.get('#create').click()
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('a blog created by cypress').should('not.exist')
    })

    it('Remove button is not shown to a user who did not add the blog', function() {
      cy.contains('create new').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.com')
      cy.get('#create').click()
      cy.contains('view').click()
      cy.contains('logout').click()
      cy.get('input:first').type('notmluukkai')
      cy.get('input:last').type('notsalainen')
      cy.get('form > button').click()
      cy.contains('remove').should('not.exist')
    })

    it('Blogs are ordered according to likes', function() {
      cy.contains('create new').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.com')
      cy.get('#create').click()
      cy.contains('view').click()
      
      cy.contains('create new').click()
      cy.get('#title').type('a blog created by cypress2')
      cy.get('#author').type('cypress2')
      cy.get('#url').type('www.cypress2.com')
      cy.get('#create').click()
      cy.contains('view').click()

      cy.contains('create new').click()
      cy.get('#title').type('a blog created by cypress3')
      cy.get('#author').type('cypress3')
      cy.get('#url').type('www.cypress3.com')
      cy.get('#create').click()
      cy.contains('view').click()

      cy.contains('a blog created by cypress3').contains('like').click()
      cy.contains('a blog created by cypress2').contains('like').click()
      cy.contains('a blog created by cypress3').contains('like').click()
      cy.contains('a blog created by cypress').contains('like').click()
      cy.contains('a blog created by cypress2').contains('like').click()
      cy.contains('a blog created by cypress3').contains('like').click()

      cy.get('.blog').eq(0).contains('a blog created by cypress3')
      cy.get('.blog').eq(1).contains('a blog created by cypress2')
      cy.get('.blog').eq(2).contains('a blog created by cypress')
    })
  })

})