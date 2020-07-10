<template>
  <div class="card white">
    <div class="card-content black-text">
      <span class="card-title">
        Options
      </span>
      <div class="section"
           id="basic"
           style="padding-bottom: 0;">
        <div class="row section"
             style="margin-bottom: 0; padding-bottom: 0;">
          <div class="col s9">
            Instant translation while you type
          </div>
          <div class="col s3 switch right-align">
            <label>
              <input type="checkbox"
                     ng-model="host.instant"
                     ng-change="host.instant ? host.generate() : null">
              <span class="lever">
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <ul class="collapsible"
        data-collapsible="expandable"
        style="box-shadow: none; border-right: none; border-left: none;">
      <li>
        <div class="collapsible-header">
          <i class="material-icons">edit</i>
          Drawing
          <i class="material-icons right">expand_more </i>
        </div>
        <div class="collapsible-body">
          <div class="row valign-wrapper">
            <div class="col s4">
              Language
            </div>
            <div class="col s8 input-field right-align">
              <select ng-model="host.lang"
                      ng-options="lang for lang in host.langs"
                      ng-change="host.instant ? host.generate() : null">
              </select>
            </div>
          </div>
          <div class="row valign-wrapper">
            <div class="col s6">
              Sentence structure
            </div>
            <div class="col s6 input-field right-align">
              <select ng-model="host.structure.sentence"
                      ng-options="structure for structure in host.structures"
                      ng-change="host.instant ? host.generate() : null">
              </select>
            </div>
          </div>
          <div class="row valign-wrapper">
            <div class="col s6">
              Paragraph structure
            </div>
            <div class="col s6 input-field right-align">
              <select ng-model="host.structure.sentence"
                      ng-options="structure for structure in host.structures"
                      ng-change="host.instant ? host.generate() : null">
              </select>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="collapsible-header">
          <i class="material-icons">image</i>
          Output
          <i class="material-icons right">expand_more</i>
        </div>
        <div class="collapsible-body">
          <div class="row valign-wrapper">
            <div class="col s6">
              Width of image (px)
            </div>
            <div class="col s6 input-field right-align">
              <input class="center-align"
                     type="number"
                     ng-model="host.width"
                     ng-change="host.instant ? host.generate() : null">
            </div>
          </div>
          <div class="row section">
            <div class="col s9">
              Watermark
            </div>
            <div class="col s3 switch right-align">
              <label>
                <input type="checkbox"
                       ng-model="host.watermark"
                       ng-change="host.instant ? host.generate() : null">
                <span class="lever">
                </span>
              </label>
            </div>
          </div>
          <div class="row  valign-wrapper">
            <div class="col s7 m9">
              Foreground colour (leave blank for transparent)
            </div>
            <div class="col s5 m3 input-field right-align">
              <input class="center-align"
                     type="text"
                     ng-model="host.fore"
                     ng-change="host.instant ? host.generate() : null">
            </div>
          </div>
          <div class="row  valign-wrapper">
            <div class="col s7 m9">
              Background colour (leave blank for transparent)
            </div>
            <div class="col s5 m3 input-field right-align">
              <input class="center-align"
                     type="text"
                     ng-model="host.back"
                     ng-change="host.instant ? host.generate() : null">
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({})
</script>
