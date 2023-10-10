import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class App extends Component {
  state = {
    category: categoriesList[0].id,
    data: [],
    apiStatus: apiStatusConst.initial,
  }

  componentDidMount() {
    this.getProjectData()
  }

  getProjectData = async () => {
    this.setState({apiStatus: apiStatusConst.inprogress})
    const {category} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${category}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))

      this.setState({apiStatus: apiStatusConst.success, data: updatedData})
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  onSelectInput = event => {
    this.setState({category: event.target.value}, this.getProjectData)
  }

  renderSuccessView = () => {
    const {data} = this.state

    return (
      <ul className="data-list-container">
        {data.map(each => (
          <li key={each.id} className="list-item-card">
            <img
              src={each.imageUrl}
              alt={each.name}
              className="project-image"
            />
            <p className="project-name"> {each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderInprogressView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#101010" height="50" width="50" />
    </div>
  )

  onRetryBtn = () => {
    this.getProjectData()
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1> Oops! Something Went Wrong</h1>
      <p> We cannot seem to find the page you are looking for.</p>
      <button type="button" className="retry-btn" onClick={this.onRetryBtn}>
        {' '}
        Retry
      </button>
    </div>
  )

  renderAppRouter = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConst.success:
        return this.renderSuccessView()
      case apiStatusConst.inprogress:
        return this.renderInprogressView()
      case apiStatusConst.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state
    return (
      <div>
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>

        <div>
          <select
            value={category}
            className="select-ele"
            onChange={this.onSelectInput}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {' '}
                {each.displayText}
              </option>
            ))}
          </select>
        </div>

        {this.renderAppRouter()}
      </div>
    )
  }
}

export default App
