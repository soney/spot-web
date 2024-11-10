import * as React from 'react'
import { MemberListDisplay, MemberListLayout } from '../components/members';
import { graphql, Link } from 'gatsby';
import { Layout, LayoutHead, SpotPage } from '../components/layout';
import ReactMarkdown from 'react-markdown';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { getDownloadName } from '../components/publications';
import { GatsbyImage } from 'gatsby-plugin-image';
import { FileText, User, File } from 'lucide-react';
// import { config } from "@fortawesome/fontawesome-svg-core";
// import "@fortawesome/fontawesome-svg-core/styles.css";
// config.autoAddCss = false

export const indexQuery = graphql`query news {
    allStrapiNewsitem {
        nodes {
            id
            createdAt
            date
            description {
                data {
                    description
                }
            }
            relevant_people {
                id
                family_name
                given_name
                homepage
                use_local_homepage
                color
                focused_headshot {
                    localFile {
                        childImageSharp {
                            gatsbyImageData(
                                height: 20
                                aspectRatio: 1
                                placeholder: BLURRED
                                formats: JPG
                                layout: CONSTRAINED
                            )
                        }
                    }
                }
                headshot {
                    localFile {
                        childImageSharp {
                            gatsbyImageData(
                                height: 20
                                placeholder: BLURRED
                                formats: JPG
                                layout: CONSTRAINED
                            )
                        }
                    }
                }
            }
            relevant_publications {
                id
                title
                authors {
                    family_name
                    given_name
                }
                venue {
                    id
                    location
                    year
                    homepage
                    conference_start
                    conference_end
                    short_name
                    full_name
                    type
                }
            }
        }
    }
}`;


const monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const shortMonthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toMonthAndYear(dateString: string, useShortMonth: boolean): string {
    const dateParts = dateString.split("-");
    const monthNumber = parseInt(dateParts[1]);
    const year = useShortMonth ? `'${dateParts[0].substring(2)}` : dateParts[0];
    const monthName = useShortMonth ? shortMonthNames[monthNumber - 1] : monthNames[monthNumber - 1];

    return `${monthName} ${year}`;
}

function NewsItemDisplay(props: {newsItem: Queries.STRAPI_NEWSITEM, condensed?: boolean}): JSX.Element {
    const newsItem = props.newsItem;
    const date = newsItem.date || newsItem.createdAt;
    const dateDisplay = date ? <strong>{toMonthAndYear(date, props.condensed===true)}: </strong> : '';

    const relevantPeopleDisplays = newsItem.relevant_people.map((person) => {
        const fullName = `${person.given_name} ${person.family_name}`;
        const headshot = person.focused_headshot || person.headshot;
        // const img = headshot ? <GatsbyImage imgStyle={{borderRadius: '50%', border: `2px solid ${person.color}`}} className="member-news-avatar" image={headshot.localFile.childImageSharp.gatsbyImageData} alt={`Headshot of ${fullName}`} /> : <FontAwesomeIcon icon={regular("user")} />;
        const img = headshot ? <GatsbyImage imgStyle={{borderRadius: '50%', border: `2px solid ${person.color}`}} className="member-news-avatar" image={headshot.localFile.childImageSharp.gatsbyImageData} alt={`Headshot of ${fullName}`} /> : <User />;

        // const personText = props.condensed ? <><FontAwesomeIcon icon={regular("user")} /></> : <><FontAwesomeIcon icon={regular("user")} />&nbsp;{fullName}</>;
        const personText = props.condensed ? img : <>{img}&nbsp;{fullName}</>;
        let personLink;
        if(person.use_local_homepage) {
            personLink = <Link style={props.condensed && {color: person.color}} className="author-internal-link" to={`/${person.given_name}_${person.family_name}`} title={fullName}>{personText}</Link>
        } else if(person.homepage) {
            personLink = <a style={props.condensed && {color: person.color}} className="author-external-link" href={person.homepage} target="_blank" title={fullName}>{personText}</a>;
        } else {
            personLink = <span title={fullName}>{personText}</span>;
        }
        return <li key={person.id} className='relevant-person'>{personLink}</li>;
    });

    const relevantPublicationDisplays = newsItem.relevant_publications.map((pub) => {
        // const icon = ['journal', 'conference'].indexOf(pub.venue.type)>=0 ? <FontAwesomeIcon icon={regular('file-lines')} /> : <FontAwesomeIcon icon={regular('file')} />;
        const icon = ['journal', 'conference'].indexOf(pub.venue.type)>=0 ? <FileText /> : <File />;
        const pubText = props.condensed ? icon : <>{icon}&nbsp;{pub.title}</>;
        return <li key={pub.id} className='relevant-publication'><Link to={"/" + getDownloadName(pub)} title={pub.title}>{pubText}</Link></li>
    });

    return <li className='news-item'>
        {dateDisplay}<ReactMarkdown>{newsItem.description.data.description}</ReactMarkdown>
        <ul>{relevantPeopleDisplays}{relevantPublicationDisplays}</ul>
    </li>
};

export function NewsDisplay(props: {newsItems: readonly Queries.STRAPI_NEWSITEM[], condensed?: boolean, latest: number|false}): JSX.Element {
    const newsItems = props.newsItems.slice();
    const sortedNewsItems = newsItems.sort((a, b) => { const aDate = (a.date || a.createdAt); const bDate = (b.date || b.createdAt); return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;});
    const news = props.latest===false ? sortedNewsItems : sortedNewsItems.slice(0, props.latest);
    const newsItemDisplays = news.map((newsItem) => <NewsItemDisplay condensed={props.condensed} key={newsItem.id} newsItem={newsItem} />);
    return <ul className='news-container'>{newsItemDisplays}</ul>;
};

interface NewsPageProps {
    data: {
        allStrapiNewsitem: Queries.STRAPI_NEWSITEMConnection
    }
}

export const Head = LayoutHead('News');
export default class extends React.Component<NewsPageProps, {}> {
    constructor(props: NewsPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;

        return <Layout active={SpotPage.news}>
            <div className="news-page container">
                <h2 className="">News</h2>
                <NewsDisplay newsItems={data.allStrapiNewsitem.nodes} latest={false} />
            </div>
        </Layout>;
    }
}