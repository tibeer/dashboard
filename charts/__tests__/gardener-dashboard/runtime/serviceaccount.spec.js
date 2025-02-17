//
// SPDX-FileCopyrightText: 2021 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

'use strict'

const { basename } = require('path')
const { helm } = fixtures

const renderTemplates = helm.renderTemplatesFn('gardener-dashboard', 'charts', basename(__dirname))

describe('gardener-dashboard', function () {
  describe('serviceaccount', function () {
    let templates

    beforeEach(() => {
      templates = [
        'serviceaccount'
      ]
    })

    it('should not render the template with default values', async function () {
      const values = {}
      const documents = await renderTemplates(templates, values)
      expect(documents).toHaveLength(1)
      const [serviceaccount] = documents
      expect(serviceaccount).toBeFalsy()
    })

    describe('when virtual garden is enabled', function () {
      it('should render the template', async function () {
        const values = {
          global: {
            virtualGarden: {
              enabled: true
            },
            serviceAccountTokenVolumeProjection: {
              enabled: true
            }
          }
        }
        const documents = await renderTemplates(templates, values)
        expect(documents).toHaveLength(1)
        const [serviceaccount] = documents
        expect(serviceaccount).toMatchSnapshot()
      })

      it('should not render the template', async function () {
        const values = {
          global: {
            virtualGarden: {
              enabled: true
            },
            serviceAccountTokenVolumeProjection: {
              enabled: false
            }
          }
        }
        const documents = await renderTemplates(templates, values)
        expect(documents).toHaveLength(1)
        const [serviceaccount] = documents
        expect(serviceaccount).toBeFalsy()
      })
    })
  })
})
