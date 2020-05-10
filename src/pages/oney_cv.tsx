import * as React from 'react'
import { Helmet } from 'react-helmet';
import './cv.scss'

interface IndexPageProps {
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps, context: {}) {
        super(props, context);
    }
    public render() {
        return <div className="container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Steve Oney &ndash; Curriculum Vitae</title>
                    <link rel="stylesheet" href="https://use.typekit.net/csn6djz.css"></link>
                </Helmet>
                <div className="row">
                    <div className="col side"></div>
                    <div className="col main">
                        <h1 className="name_header">Steve Oney</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col side"></div>
                    <div className="col main">
                        <div className="row">
                            <div className="col affiliation">
                                <div className="affiliation-department">School of Information</div>
                                <div className="affiliation-university">University of Michigan</div>
                                <div className="affiliation-office">4381 North Quadrangle</div>
                                <div className="affiliation-street">105 South State Street</div>
                                <div className="affiliation-city">Ann Arbor, MI 48109</div>
                            </div>
                            <div className="col contact">
                                <div className="contact-spacer"></div>
                                <div className="contact-spacer"></div>
                                <div className="contact-homepage"><a href="http://from.so/">http://from.so/</a></div>
                                <div className="contact-phone"><a href="tel:17349990246">1 (734) 999–0246</a></div>
                                <div className="contact-email"><a href="mailto:soney@umich.edu">soney@umich.edu</a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section education">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Education</h2>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side col-2">
                            <div className="date-range">09/2008 &ndash; 04/2015</div>
                            <div className="location">Pittsburgh, PA</div>
                        </div>
                        <div className="col main col-8">
                            <div className="education-school">Carnegie Mellon University</div>
                            <table className="education-degrees">
                                <tbody>
                                    <tr> <td>PhD&nbsp;</td><td>in Human-Computer Interaction</td> </tr>
                                    <tr> <td>MS&nbsp;</td><td>in Human-Computer Interaction</td> </tr>
                                </tbody>
                            </table>
                            <table className="education-advisors">
                                <tbody>
                                    <tr> <td>Advisors:&nbsp;</td><td>Brad Myers and Joel Brandt</td> </tr>
                                    <tr> <td>Committee:&nbsp;</td><td>Scott Hudson and John Zimmerman</td> </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2003 &ndash; 08/2008</div>
                            <div className="location">Cambridge, MA</div>
                        </div>
                        <div className="col main">
                            <div className="education-school">Massachusetts Institute of Technology</div>
                            <div className="education-degree">MEng in Computer Science (thesis T.1 below)</div>
                            <div className="education-degree">SB in Computer Science</div>
                            <div className="education-degree">SB in Mathematics</div>
                        </div>
                    </div>
                </div>
                <div className="section experience">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Professional Experience</h2>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2016 &ndash; present</div>
                            <div className="location">Ann Arbor, MI</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">School of Information, University of Michigan</div>
                            <div className="experience-description">Assistant Professor</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">01/2017 &ndash; present</div>
                            <div className="location">Ann Arbor, MI</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">Computer Science and Engineering, University of Michigan</div>
                            <div className="experience-description">Assistant Professor (by courtesy)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2015 &ndash; 09/2016</div>
                            <div className="location">Ann Arbor, MI</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">School of Information, University of Michigan</div>
                            <div className="experience-description">Presidents Post-Doctoral Fellow</div>
                        </div>
                    </div>
                </div>
            </div>
    }
}