import { graphql } from 'gatsby';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Layout, LayoutHead, SpotPage } from '../components/layout';
import { PublicationListDisplay } from '../components/publication-list';
import './member.scss';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { GatsbyImage } from 'gatsby-plugin-image';
import { House } from 'lucide-react';

export const memberQuery = graphql`query member($id: String!) {
    strapiAuthor(id: {eq: $id}) {
        id
        given_name
        family_name
        middle_name
        homepage
        short_bio
        long_bio
        membership
        links {
            id
            url
            description
        }
        headshot {
            localFile {
                publicURL
                childImageSharp {
                    gatsbyImageData(
                        width: 900
                        placeholder: BLURRED
                        formats: JPG
                        layout: CONSTRAINED
                    )
                }
            }
        }
    }
}`;

interface MemberProps {
    data: {
        strapiAuthor: Queries.STRAPI_AUTHOR,
    }
    pageContext: {
        pubs: ReadonlyArray<Queries.STRAPI_PUBLICATION>
    }
}

export const Head = LayoutHead((props: MemberProps) => `${props.data.strapiAuthor.given_name} ${props.data.strapiAuthor.family_name}`);

export default class extends React.Component<MemberProps, {}> {
    constructor(props: MemberProps) {
        super(props);
    }
    public render() {
        const author = this.props.data.strapiAuthor;
        const pubs = this.props.pageContext.pubs;
        const links = author.links ? author.links.map((l) => {
            return <li key={l.id} className="breadcrumb-item"><a href={l.url} target='_blank'>{l.description}</a></li>
        }) : [];

        const pubsDisplay = <PublicationListDisplay data={pubs} groupByVenue={false} highlightAuthors={[author.id]} />
        return (
            <Layout active={SpotPage.team} additionalInfo={`${author.given_name} ${author.family_name}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8">
                            <h1 className='person'>{author.given_name} {author.family_name}</h1>
                        </div>
                        <div className="col-sm-4 text-end short-bio">
                            {author.short_bio}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            {author.headshot &&
                            <a href={author.headshot.localFile.publicURL} target='_blank'>
                                <GatsbyImage image={author.headshot.localFile.childImageSharp.gatsbyImageData} className="member-headshot" title={`Headshot of ${author.given_name} ${author.family_name}`} alt={`Headshot of ${author.given_name} ${author.family_name}`} imgStyle={{borderRadius: 3}} />
                            </a>
                            }
                        </div>
                        <div className="col-sm-9">
                            <ReactMarkdown>{author.long_bio}</ReactMarkdown>
                            <ul className="breadcrumb">
                                {/* <li className="breadcrumb-item"><FontAwesomeIcon icon={solid("house")} />&nbsp;<a href={author.homepage} target='_blank'>Homepage</a></li> */}
                                <li className="breadcrumb-item"><House size={18} />&nbsp;<a href={author.homepage} target='_blank'>Homepage</a></li>
                                {links}
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <h2 className="col">Publications</h2>
                    </div>
                    <ul className="publication-list">{pubsDisplay}</ul>
                </div>
            </Layout>
        );
    }
}