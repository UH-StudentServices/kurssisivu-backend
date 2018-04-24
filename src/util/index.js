const _ = require('lodash')
const moment = require('moment')

const formatCourse = (course) => {
  const organizationsOf = (c) => {
    const codes = c['organisations'].map(o => o.code)
      .concat(...c['courses_extra_organisations'].map(o => o.code))
      .concat(...c['providing_organisation'].map(o => o.code))

    return _.uniq(codes)
  }

  const relevantKeys = [
    'start_date', 'end_date', 'credit_points', 'course_id', 'parent_id',
    'learningopportunity_id', 'languages', 'realisation_name', 'realisation_type_code',
  ]

  const formattedCourse = relevantKeys.reduce((object, key) => {
    object[key] = course[key]; return object
  }, {})

  formattedCourse.organisations = organizationsOf(course)

  return formattedCourse
}

const getCoursePeriods = (periodInfo) => async (course) => {
  const groupByYear = (periods, period) => {
    const year = moment(period.start_date).year()

    periods[year] = periods[year] ? periods[year].concat(period) : [period]

    return periods
  }

  const periodsOfYear = periodInfo.reduce(groupByYear, {})

  const courseStart = moment(course.start_date)
  const courseEnd = moment(course.end_date)
  const possiblePeriods = periodsOfYear[courseStart.year()]

  const periodNumber = (period) => {
    const finnishName = period.name.find(name => name.langcode === 'fi')

    if (finnishName.text[11] === 'K') {
      return 5
    }

    return Number(finnishName.text[11])
  }

  const intersectsWithCourse = (period) => {
    const periodStart = moment(period.start_date)
    const periodEnd = moment(period.end_date)

    return courseStart.isBetween(periodStart, periodEnd, null, '[]')
      || courseEnd.isBetween(periodStart, periodEnd, null, '[]')
  }

  return possiblePeriods.filter(intersectsWithCourse).map(periodNumber)
}

const periodsOfSemester = (semester) => {
  if (semester === 'autumn') {
    return [1, 2]
  } else if (semester === 'spring') {
    return [3, 4]
  } else if (semester === 'summer') {
    return [5]
  }

  return [1, 2, 3, 4, 5]
}

module.exports = {
  formatCourse,
  getCoursePeriods,
  periodsOfSemester
}