import * as React from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet';
import './layout.scss'

export enum SpotPage {
    home='home', research='research', team='team', news='news', writing='writing'
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
            <nav className="navbar navbar-expand navbar-light bg-light">
                <div className='container'>
                    <Link className={"navbar-brand"+this.getActiveClass(SpotPage.home)} to="/">spot</Link>
                    {/* <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button> */}
                    <div className="navbar-collapse collapse" id="collapseNavbar">
                        <ul className="navbar-nav">
                            <li className={"nav-item"+this.getActiveClass(SpotPage.research)}><Link to="/research" className="nav-link">Research</Link>{this.getAdditionalInfo(SpotPage.research)}</li>
                            <li className={"nav-item"+this.getActiveClass(SpotPage.team)}><Link to="/team" className="nav-link">Team</Link>{this.getAdditionalInfo(SpotPage.team)}</li>
                            <li className={"nav-item"+this.getActiveClass(SpotPage.news)}><Link to="/news" className="nav-link">News</Link></li>
                            {/* <li className={"nav-item"+this.getActiveClass(SpotPage.writing)}><Link to="/writing" className="nav-link">Writing</Link></li> */}
                        </ul>
                    </div>
                </div>
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