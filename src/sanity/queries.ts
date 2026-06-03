/**
 * GROQ queries used by the public site.
 *
 * Each query returns either a singleton document (homePage, preConstructionPage,
 * siteSettings) or a sorted list (teamMembers, sectors).
 */

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0]{
    siteName,
    "logoUrl": logo.asset->url,
    "footerLogoUrl": footerLogo.asset->url,
    "faviconUrl": favicon.asset->url,
    contactEmail,
    contactPhone,
    address,
    careersUrl,
    metaDescription
  }
`

export const homePageQuery = /* groq */ `
  *[_type == "homePage"][0]{
    heroHeadingLine1,
    heroHeadingLine2,
    "heroVideoUrl": heroVideo.asset->url,
    "heroPosterUrl": heroPosterImage.asset->url,
    aboutEyebrow, aboutHeading, aboutBody,
    "aboutImageUrl": aboutImage.asset->url,
    diversityEyebrow, diversityHeading, diversityBody,
    "diversityImageUrl": diversityImage.asset->url,
    technologyEyebrow, technologyHeading, technologyBody,
    technologyFeatures[]{
      title,
      description,
      "imageUrl": image.asset->url
    },
    expertiseEyebrow, expertiseHeading, expertiseBody,
    sectors[]->{
      _id, name, description, "iconUrl": icon.asset->url, order
    },
    peopleEyebrow, peopleHeading, peopleBody,
    teamMembers[]->{
      _id, name, role, "photoUrl": photo.asset->url, order
    },
    contactEyebrow, contactHeading, contactBody,
    metaTitle, metaDescription,
    "ogImageUrl": ogImage.asset->url
  }
`

export const preConstructionPageQuery = /* groq */ `
  *[_type == "preConstructionPage"][0]{
    heroEyebrow, heroHeading, heroBody,
    services[]{
      title, eyebrow, headingLine1, headingLine2, body,
      "videoUrl": video.asset->url,
      "posterUrl": posterImage.asset->url
    },
    ctaHeading, ctaBody,
    metaTitle, metaDescription,
    "ogImageUrl": ogImage.asset->url
  }
`
