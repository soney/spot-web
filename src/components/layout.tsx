import * as React from 'react'
import Link from 'gatsby-link'
import { Helmet } from 'react-helmet';
import './layout.scss'

export enum SpotPage {
    home='home', research='research', team='team'
}

interface LayoutProperties {
    children: (JSX.Element|string|(JSX.Element|string)[]),
    active: SpotPage,
    additionalInfo?: string,
    title?: string
}
export class Layout extends React.Component<LayoutProperties, {}> {
    constructor(props: LayoutProperties) {
        super(props);
    }
    public render() {
        return <div className='application'>
            <Helmet>
                <html lang="en" />
                <meta charSet="utf-8" />
                <title>{ (this.props.title ? `${this.props.title} | ` : '') + 'Spot Research Group' }</title>
            </Helmet>
            <nav className="container navbar navbar-expand-sm navbar-light bg-light">
                <Link className={"navbar-brand"+this.getActiveClass(SpotPage.home)} to="/">spot</Link>
                <ul className="navbar-nav">
                    <li className={"nav-item"+this.getActiveClass(SpotPage.research)}><Link to="/research" className="nav-link">Research</Link>{this.getAdditionalInfo(SpotPage.research)}</li>
                    <li className={"nav-item"+this.getActiveClass(SpotPage.team)}><Link to="/team" className="nav-link">Team</Link>{this.getAdditionalInfo(SpotPage.team)}</li>
                </ul>
            </nav>
            <main role="main" className="">{this.props.children}</main>
        </div>;
    }
    private getActiveClass(pageName: SpotPage): string {
        return pageName===this.props.active ? ' active' : '';
    }
    private getAdditionalInfo(pageName: SpotPage): JSX.Element|null {
        if(this.props.active === pageName && this.props.additionalInfo) {
            return <span className='subtitle'> / {this.props.additionalInfo}</span>
        } else {
            return null;
        }
    }
}