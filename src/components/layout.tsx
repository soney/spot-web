import * as React from 'react'
import Link from 'gatsby-link'
import { Helmet } from 'react-helmet';
import './layout.scss'

interface LayoutProperties {
    children: (JSX.Element|string|(JSX.Element|string)[])
}
export class Layout extends React.Component<LayoutProperties, {}> {
    constructor(props: LayoutProperties, context: {}) {
        super(props, context);
    }
    public render() {
        return <div className='application'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Spot Group</title>
            </Helmet>
            <nav className="container navbar navbar-expand-sm navbar-light bg-light">
                <Link className="navbar-brand" to="/">
                    spot research group
                </Link>
                <ul className="navbar-nav">
                    {/* <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li> */}
                    <li className="nav-item"><Link to="/research" className="nav-link">Research</Link></li>
                </ul>
            </nav>
            <main role="main" className="">{this.props.children}</main>
        </div>;
    }
}