const courseInfo = async (id) => {
  const course = require(`./course_infos/${id}.json`)
  return Promise.resolve(course)
}

const learningOpportunityInfo = async (opportunityId) => {
  const opportunity = require(`./learning_opportunities/${opportunityId}.json`)
  return Promise.resolve(opportunity)
}

module.exports =  (url) => {
  if (url.includes('codes/courseunitrealisations/periods')) {
    return Promise.resolve(require('./period_info.json'))
  } else if (url.includes('courseunitrealisations/organisations')) {
    return Promise.resolve([
      { organisation_id: '500-K005', course_id: 119284687 },
      { organisation_id: '500-K005', course_id: 119284691 },
    ])
  } else if (url.includes('courseunitrealisations/')){
    const id = url.substring(url.length - 9) 
    return Promise.resolve(require(`./course_infos/${id}.json`))
  } else if (url.includes('learningopportunities/')) {
    const id = url.substring(url.length - 8)
    return Promise.resolve(require(`./learning_opportunities/${id}.json`))
  }
  
  throw `mock unable to handle request to ${url}`;
}