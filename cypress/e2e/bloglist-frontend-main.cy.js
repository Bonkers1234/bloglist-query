
const user = {
  username: 'TEST',
  name: 'TEST',
  password: 'TEST'
}

const userNext = {
  username: 'secondUser',
  name: 'userNext',
  password: 'secondUser'
}

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, userNext)
    cy.visit('')
  })

  //5.17
  it('Login form is shown', function() {
    cy.contains('log in to application') //this is sufficient for exercise 5.17
    cy.contains('username')
    cy.contains('password')
    // example of how to use CSS selectors, list can be found here https://www.w3schools.com/cssref/css_selectors.php
    cy.get('input[name="Username"]')
    cy.get('input[name="Password"]')
  })

  //5.18
  describe('Login', function() {
    it('succeeds with proper credentials', function() {
      cy.get('input[name="Username"]').type(user.username)
      cy.get('input[name="Password"]').type(user.password)
      cy.contains('login').click()

      cy.contains('Welcome')
    })
    //5.18
    it('fails with wrong credentials', function() {
      cy.get('input[name="Username"]').type('Wrong')
      cy.get('input[name="Password"]').type(user.password)
      cy.contains('login').click()

      cy.contains('invalid username or password ')
      //Extra exercise for 5.18
      cy.get('.info')
        .should('contain', 'invalid username or password ')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .should('have.css', 'border-style', 'solid')
    })

    //5.19
    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: user.username, password: user.password })
      })

      it('A blog can be created', function() {
        cy.contains('new blog').click()
        cy.get('input[name="Title"]').type('Test title')
        cy.get('input[name="Author"]').type('Test author')
        cy.get('input[name="Url"]').type('Test url')
        cy.contains('create').click()

        cy.contains('Test title - Test author') //this one finds exact blogpost since there isnt anything else containing exact match
        cy.contains('Test title') //this one finds first thing that CONTAINS searched text which is the Notification
      })

      //5.20
      describe('When there is already a blog made', function() {
        beforeEach(function() {
          cy.createBlog({
            title: 'New Test Blog',
            author: 'Test User',
            url: 'www.test.com'
          })
        })
        //5.20
        it('a user can like a blog', function() {
          cy.contains('New Test Blog').contains('show').click()
          cy.contains('likes 0').find('button').click()

          cy.contains('likes 1') //could also check for Notification Component etc.
        })

        //5.21
        it('a user who created blog can delete it', function() {
          cy.contains('show').click()
          cy.contains('delete').click()

          cy.contains('removed.')
          cy.get('html').should('not.contain', 'New Test Blog - Test User')
        })

        //5.22
        it('only creator can see delete button', function() {
          cy.contains('logout').click()
          cy.login({ username: userNext.username, password: userNext.password })

          cy.contains('show').click()
          // cy.get('html').should('not.contain', 'delete')
          cy.contains('delete').should('not.exist') //this is model answer, more efficient since it doesnt call ENTIRE html
        })
      })

      //5.23
      describe('When there are several blogs', function() {
        beforeEach(function() {
          cy.createBlog({ title: 'Blog BEST', author: 'test', url: 'www.test.com' })
          cy.createBlog({ title: 'Blog AVERAGE', author: 'test', url: 'www.test.com' })
          cy.createBlog({ title: 'Blog WORST', author: 'test', url: 'www.test.com' })
        })
        //5.23
        it('blogs are order according to likes', function() {
          // use of 'as()' for simplicity
          cy.contains('BEST').contains('show').click().parent().contains('like').as('BESTlike')
          cy.contains('AVERAGE').contains('show').click().parent().contains('like').as('AVERAGElike')
          cy.contains('WORST').contains('show').click().parent().contains('like').as('WORSTlike')

          for(let n = 0; n < 2; n++) {
            cy.get('@BESTlike').click()
            cy.wait(400)
          }

          cy.get('@AVERAGElike').click()

          // added 'blog' class to Blog Component so 'get()' will fetch ALL 'blogs' so we can access them with 'eq()' to check order
          cy.get('.blog').eq(0).should('contain', 'Blog BEST')
          cy.get('.blog').eq(1).should('contain', 'Blog AVERAGE')
          cy.get('.blog').eq(2).should('contain', 'Blog WORST')
        })
      })
    })
  })
})