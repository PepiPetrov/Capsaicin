import React from "react"
import ReactDOM from "react-dom/client"
import { Route, Router } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"

import App from "./App"

import "./styles/globals.css"

import Layout from "./components/layout"
import CreatePage from "./pages/CreatePage"
import DetailsPage from "./pages/DetailsPage"
import EditPage from "./pages/EditPage"
import ImportRecipePage from "./pages/ImportRecipePage"
import RecipePlanner from "./pages/RecipePlanner"
import SearchPage from "./pages/SearchPage"

ReactDOM.createRoot(
  document.getElementById("root") ?? new HTMLElement()
).render(
  <React.StrictMode>
    <Router hook={useHashLocation}>
      <Router hook={useHashLocation}>
        <Route path="/">
          <Layout>
            <App />
          </Layout>
        </Route>

        <Route path="/create">
          <Layout>
            <CreatePage />
          </Layout>
        </Route>

        <Route path="/details/:id">
          {(params) => (
            <Layout>
              <DetailsPage id={parseInt(params.id, 10)} />
            </Layout>
          )}
        </Route>

        <Route path="/edit/:id">
          {(params) => (
            <Layout>
              <EditPage id={parseInt(params.id, 10)} />
            </Layout>
          )}
        </Route>

        <Route path="/search">
          <Layout>
            <SearchPage />
          </Layout>
        </Route>

        <Route path="/import">
          <Layout>
            <ImportRecipePage />
          </Layout>
        </Route>

        <Route path="/planner">
          <Layout>
            <RecipePlanner />
          </Layout>
        </Route>
      </Router>
    </Router>
  </React.StrictMode>
)
