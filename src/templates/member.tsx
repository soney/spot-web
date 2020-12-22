import { graphql } from 'gatsby';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { StrapiAuthor, StrapiPublication } from '../../graphql-types';
import { Layout, SpotPage } from '../components/layout';
import { PublicationListDisplay } from '../components/publication-list';
import './member.scss';
import Img from "gatsby-image"

export const memberQuery = graphql`query member($id: String!) {
    strapiAuthor(id: {eq: $id}) {
        id
        strapiId
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
        media {
            id
            description
            media {
                publicURL
            }
        }
        headshot {
            childImageSharp {
                fluid(maxWidth: 900) {
                    base64
                    aspectRatio
                    src
                    srcSet
                    sizes
                }
            }
        }
    }
}`;

interface MemberProps {
    data: {
        strapiAuthor: StrapiAuthor,
    }
    pageContext: {
        pubs: ReadonlyArray<StrapiPublication>
    }
}

export default class extends React.Component<MemberProps, {}> {
    constructor(props: MemberProps) {
        super(props);
    }
    public render() {
        const author = this.props.data.strapiAuthor;
        const pubs = this.props.pageContext.pubs;
        const links = author.links.map((l) => {
            return <li key={l.id} className="breadcrumb-item"><a href={l.url} target='_blank'>{l.description}</a></li>
        });
        const media = author.media.map((m) => {
            return <li key={m.id} className="breadcrumb-item"><a href={m.media.publicURL} download={`${author.family_name}-${m.description}`} target='_blank'>{m.description}</a></li>
        })
        const pubsDisplay = <PublicationListDisplay data={pubs} groupByVenue={false} highlightAuthors={[author.strapiId]} />
        return (
            <Layout title={`${author.given_name} ${author.family_name}`} active={SpotPage.team} additionalInfo={`${author.given_name} ${author.family_name}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8">
                            <h1 className='person'>{author.given_name} {author.family_name}</h1>
                        </div>
                        <div className="col-sm-4 text-right short-bio">
                            {author.short_bio}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <Img fluid={author.headshot.childImageSharp.fluid as any} alt={`Headshot of ${author.given_name} ${author.family_name}`} />
                        </div>
                        <div className="col-sm-9">
                            <ReactMarkdown source={author.long_bio} />
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><i className="fas fa-home" />&nbsp;<a href={author.homepage} target='_blank'>Homepage</a></li>
                                {links}
                                {media}
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