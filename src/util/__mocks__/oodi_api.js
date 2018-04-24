const courseInfo = async (id) => {
  const course = require(`./course_infos/${id}.json`)
  return Promise.resolve(course)
}

const learningOpportunityInfo = async (opportunityId) => {
  const opportunity = require(`./learning_opportunities/${opportunityId}.json`)
  return Promise.resolve(opportunity)
}

const courseIdsOfOrganization = async (organization) => {
  return Promise.resolve([119284687,119284691])
}

const periodInfo = async () => {
  const periods = require('./period_info.json')
  return Promise.resolve(periods)
}

module.exports = {
  courseInfo,
  periodInfo,
  learningOpportunityInfo,
  courseIdsOfOrganization,
}