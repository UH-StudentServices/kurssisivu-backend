const axios = require('axios')
const moment = require('moment')
const _ = require('lodash')

const util = require('../index')

const courseInfo = async (id) => {
  const course = require('./course_infos/119953040.json')
  return Promise.resolve(util.formatCourse(course))
}

const learningOpportunityInfo = async (opportunityId) => {
  const opportunity = require('./learning_opportunities/KUKA-103.json')
  return Promise.resolve(opportunity)
}

const courseIdsOfOrganization = async (organization) => {
  return Promise.resolve([119953040])
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