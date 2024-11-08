import * as React from 'react'
import { Link } from 'gatsby'

const NotFoundPage = () => (
    <div>
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist.</p>
        <Link to='/'>(go back to the homepage)</Link>
    </div>
)

export default NotFoundPage;