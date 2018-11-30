import { keyBy, memoize } from 'lodash';
import Header from 'ebrc-client/App/Header';
import CardBasedIndexController from 'ebrc-client/controllers/CardBasedIndexController';
import { menuItemsFromSocials, iconMenuItemsFromSocials } from 'ebrc-client/App/Utils/Utils';
import { StudyMenuItem } from 'ebrc-client/App/Studies';
import logoUrl from 'site/images/18170.png';
import heroImageUrl from 'site/images/mbio_hero.png';

export default {
  SiteHeader: () => SiteHeader,
  IndexController: () => IndexController,
  Footer: () => Footer
}

function SiteHeader() {
  return (
    <Header
      logoUrl={logoUrl}
      heroImageUrl={heroImageUrl}
      heroImagePosition="left top"
      titleWithoutDB="Microbiome"
      subTitle="A Microbiome Resource"
      tagline="A data-mining platform for interrogating microbiome experiments"
      getSiteData={getSiteData}
      makeHeaderMenuItems={makeHeaderMenuItems}
    />
  );
}

const searchesUserEmails = [ 'eupathdb@gmail.com' ];

function IndexController() {
  return (
    <CardBasedIndexController
      searchesUserEmails={searchesUserEmails}
      getSiteData={getSiteData}
      getHomeContent={getHomeContent}
    />
  );
}

function getSiteData(state) {
  return {
    studies: state.studies,
    searches: state.searchCards,
    visualizations: { isLoading: false, entities: [] }
  };
}

function getHomeContent({ studies, searches, visualizations }) {
  return [
    {
      title: 'Explore the Studies',
      contentType: 'StudyCardList',
      items: studies.entities,
      isLoading: studies.loading
    },
    {
      title: 'Explore Example Searches',
      description: 'MicrobiomeDB can be used to employ a sophisticated search strategy system to explore study data. Use the example searches below to jump to saved strategies, view their results and get acquainted with MicrobiomeDB capabilities.',
      viewAllAppUrl: '/showApplication.do?tab=public_strat',
      contentType: 'SearchCardList',
      items: searches.entities,
      isLoading: searches.loading
    },
    {
      title: 'Explore Visualization Tools',
      description: 'Gain clear insights into your data and illustrate powerful connections using our visualization and analysis tools. Use the brief tutorials below to get learn how to get started exploring data with these resources.',
      contentType: 'ImageCardList',
      items: visualizations.entities,
      isLoading: visualizations.loading
    }
  ];
}

const samplesSearchName = 'SampleQuestions.MicrobiomeSampleByMetadata';
const taxonSearchName = 'SampleQuestions.MicrobiomeSampleByTaxonAbundance';

const makeCrossStudyStudy = memoize(questions => {
  if (questions == null) return;

  const questionsByName = keyBy(questions, 'name');
  const samplesSearch = questionsByName[samplesSearchName];
  const taxonSearch = questionsByName[taxonSearchName];

  return {
    name: 'Cross Study Analysis',
    route: '/search/dataset/AllDatasets/result',
    searches: [
      {
        displayName: samplesSearch.displayName,
        name: samplesSearch.name,
        icon: samplesSearch.iconName,
      },
      {
        displayName: taxonSearch.displayName,
        name: taxonSearch.name,
        icon: taxonSearch.iconName,
      },
    ]
  };
});

function makeHeaderMenuItems(state) {
  const { siteConfig, questions } = state.globalData;
  const siteData = getSiteData(state);
  const { studies } = siteData;
  const socialIcons = iconMenuItemsFromSocials(siteConfig);
  const socialLinks = menuItemsFromSocials(siteConfig);
  const allStudiesStudy = makeCrossStudyStudy(questions);
  return {
    mainMenu: [
      {
        id: 'search',
        text: 'Search a Study',
        children: (studies.entities == null ? [] : studies.entities)
          .concat(allStudiesStudy || [])
          .map(study => ({ text: <StudyMenuItem study={study} config={siteConfig} /> }))
      },
      {
        id: 'workspace',
        text: 'Workspace',
        children: [
          {
            text: 'My Search Strategies',
            appUrl: '/showApplication.do'
          },
          {
            text: 'My Basket',
            appUrl: '/showApplication.do?tab=basket',
            loginRequired: true
          },
          {
            text: 'My Favorites',
            route: '/favorites',
            loginRequired: true
          },
          {
            text: 'Public Search Strategies',
            appUrl: '/showApplication.do?tab=public_strat'
          }
        ]
      },
      {
        id: 'community',
        text: 'Community',
        children: [
          {
            text: 'News',
            appUrl: '/showXmlDataContent.do?name=XmlQuestions.News'
          },
          {
            text: 'Public Strategies',
            appUrl: '/showApplication.do?tab=public_strat'
          },
          {
            text: 'Tutorials and Resources',
            url: 'https://docs.google.com/document/u/1/d/1a_9lPf5lV0fTW1VcA48pGsnFAcwhMOWqCTQlyHEVoAQ/pub'
          },
          {
            text: 'About MicrobiomeDB',
            route: '/about'
          },
          ...socialLinks
        ]
      },
      {
        target: '_blank',
        id: 'contactus',
        text: 'Contact Us',
        route: '/contact-us'
      }
    ],
    iconMenu: [ ...socialIcons ]
  }
}

import NewWindowLink from 'ebrc-client/components/NewWindowLink';
import { formatReleaseDate } from 'ebrc-client/util/formatters';
import { buildNumber, releaseDate, displayName, webAppUrl } from 'ebrc-client/config';

function Footer() {
  return (
    <div className="Footer">
      <div>
        <div>
          <span>
            <a href={`//${location.hostname}`}>{displayName}</a>
            <span> {buildNumber} &nbsp;&nbsp; {formatReleaseDate(releaseDate)}</span>
          </span>
          <br/>
        </div>
        <div>
          <a href="https://twitter.com/MicrobiomeDB" target="_blank">
            Follow us on <i className="fa fa-twitter"/>
          </a>
        </div>
        <div>©{new Date().getFullYear()} The EuPathDB Project Team</div>
      </div>
      <div>
        <div>
          <a href="http://www.vet.upenn.edu/">
            <img width="120" src="http://microbiomedb.org/mbio/images/PrivateLogo.png"/>
          </a>
        </div>
        <div>
          <a href="http://code.google.com/p/strategies-wdk/">
            <img width="120" src={webAppUrl + '/wdk/images/stratWDKlogo.png'} />
          </a>
        </div>
        <div>
          Please <NewWindowLink href={webAppUrl + '/app/contact-us'}>Contact Us</NewWindowLink> with any questions or comments
        </div>
      </div>
    </div>
  );
}