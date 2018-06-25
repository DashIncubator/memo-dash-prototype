import React from 'react'
import configureStore from 'redux-mock-store'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import HomeViewContainer from './scenes/home-view/home-view.container'
import LoginViewContainer from './scenes/login-view/login-view.container'
import App, { AppComponent } from './app'
import NoMatchComponent from './components/no-match/no-match.component'

describe('App', () => {
  let store
  let mockStore

  beforeEach(() => {
    // Mock store
    mockStore = configureStore()
    store = mockStore({
      user: { isLoggedIn: false }
    })

    const div = document.createElement('div')
    document.body.appendChild(div)
  })

  describe('Shallow rendering', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<App />, { context: { store } })
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('Routing', () => {
    const createWrapper = initialEntries =>
      mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={initialEntries}>
            <AppComponent init={jest.fn()} />
          </MemoryRouter>
        </Provider>
      )

    it('should redirect to login if user is not logged in', () => {
      const wrapper = createWrapper(['/home'])
      expect(wrapper.find(HomeViewContainer)).toHaveLength(0)
      expect(wrapper.find(LoginViewContainer)).toHaveLength(1)
    })

    it('should not redirect to login if user is logged in', () => {
      store = mockStore({
        user: { currentUser: { userName: 'alice' }, isLoggedIn: true }
      })
      const wrapper = createWrapper(['/home'])
      expect(wrapper.find(HomeViewContainer)).toHaveLength(1)
      expect(wrapper.find(LoginViewContainer)).toHaveLength(0)
    })

    it('should redirect to 404 if path was not found', () => {
      const wrapper = createWrapper(['/notavailable'])
      expect(wrapper.find(NoMatchComponent)).toHaveLength(1)
    })
  })
})
