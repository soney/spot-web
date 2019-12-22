import * as React from 'react'
import Link from 'gatsby-link'
import './layout.scss'

interface LayoutProperties {
    children: (JSX.Element|string|(JSX.Element|string)[])
}
export class Layout extends React.Component<LayoutProperties, {}> {
    constructor(props: LayoutProperties, context: {}) {
        super(props, context);
        console.log(this);
    }
    public render() {
        return <div className='container'>
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" to="/">
                        spot
                    </Link>
                </div>
                <div className="navbar-menu">
                    <Link to="/" className="navbar-item">Home</Link>
                    <Link to="/about" className="navbar-item">About</Link>
                    <Link to="/people" className="navbar-item">People</Link>
                    <Link to="/research" className="navbar-item">Research</Link>
                </div>
            </nav>
            <main>{this.props.children}</main>
            <footer></footer>
        </div>;
    }
}