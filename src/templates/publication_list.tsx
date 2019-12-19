import * as React from 'react'

export default class extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context)
    }
    public render() {
        const { data } = this.props;
        const publicationDisplays = data.nodes.map((node: any) => (
            <PublicationSummary key={node.id} data={node} />
        ))
        return <div>{publicationDisplays}</div>
    }
}

class PublicationSummary extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context)
    }
    public render() {
        const { data } = this.props;
        
        const firstAuthor = data.authors.length > 0 ? data.authors[0].family_name : '';
        const fname = `${firstAuthor}-${data.venue.short_name}${data.year}-${data.title.replace(/ /g, '_').replace(/\W/g, '')}`;
        const mediaDisplays = data.media.map((media: any) => (
            <a key={media.id} href={media.artifact.publicURL} download={fname}>{media.name}</a>
        ));
        const authorsDisplay = data.authors.map((author: any) => (
            <span key={author.id} className='paper-author'>{author.given_name} {author.family_name}</span>
        ));
        if (authorsDisplay.length === 2) {
            authorsDisplay.splice(1, 0, ' and ');
        } else if (authorsDisplay.length > 2) {
            authorsDisplay.splice(authorsDisplay.length-1, 0, ', and ');
            for(let i: number = authorsDisplay.length-3; i>0; i--) {
                authorsDisplay.splice(i, 0, ', ');
            }
        }
        return <div className='paper-summary'>
            <span className='paper-authors'>
                {authorsDisplay}
            </span>.
            <span className="paper-title">{data.title}.</span> <span className="paper-venue">{data.venue.long_name} ({data.venue.short_name})</span>. <span className="paper-year">{data.year}</span>
            {mediaDisplays}
        </div>;
    }

}