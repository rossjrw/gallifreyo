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
          <i class="material-icons">
            edit</i>Drawing<i class="material-icons right">expand_more
          </i>
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
          <i class="material-icons">
            image</i>Output<i class="material-icons right">expand_more
          </i>
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
      <li>
        <div class="collapsible-header">
          <i class="material-icons">
            data_usage</i>Angle sizes<i class="material-icons right">expand_more
          </i>
        </div>
        <div class="collapsible-body">
          <div class="row">
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="1angle"
                     step="0.1"
                     ng-model="host.settings.s.a"
                     ng-change="host.instant ? host.generate() : null">
              <label for="1angle">
                {{host.debug ? "s-block" : "Group 1"}}
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="2angle"
                     step="0.1"
                     ng-model="host.settings.p.a"
                     ng-change="host.instant ? host.generate() : null">
              <label for="2angle">
                {{host.debug ? "p-block" : "Group 2"}}
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="3angle"
                     step="0.1"
                     ng-model="host.settings.d.a"
                     ng-change="host.instant ? host.generate() : null">
              <label for="3angle">
                {{host.debug ? "d-block" : "Group 3"}}
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="4angle"
                     step="0.1"
                     ng-model="host.settings.f.a"
                     ng-change="host.instant ? host.generate() : null">
              <label for="4angle">
                {{host.debug ? "f-block" : "Group 4"}}
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="4angle"
                     step="0.1"
                     ng-model="host.settings.f.a"
                     ng-change="host.instant ? host.generate() : null">
              <label for="4angle">
                {{host.debug ? "v-block" : "Vowels"}}
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="5angle"
                     step="0.1"
                     ng-model="host.settings.buffer.letter"
                     ng-change="host.instant ? host.generate() : null">
              <label for="5angle">
                Letter buffer
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="6angle"
                     step="0.1"
                     ng-model="host.settings.buffer.word"
                     ng-change="host.instant ? host.generate() : null">
              <label for="6angle">
                Word buffer
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="7angle"
                     step="0.1"
                     ng-model="host.settings.buffer.sentence"
                     ng-change="host.instant ? host.generate() : null">
              <label for="7angle">
                Sentence buffer
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="8angle"
                     step="0.1"
                     ng-model="host.settings.buffer.sentence"
                     ng-change="host.instant ? host.generate() : null">
              <label for="8angle">
                Sentence buffer
              </label>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="collapsible-header">
          <i class="material-icons">
            code</i>Debug tools<i class="material-icons right">expand_more
          </i>
        </div>
        <div class="collapsible-body">
          <div class="row section">
            <div class="col s9">
              Enable debug mode
            </div>
            <div class="col s3 switch right-align">
              <label>
                <input type="checkbox"
                       ng-model="host.debug"
                       ng-change="host.instant ? host.generate() : null">
                <span class="lever">
                </span>
              </label>
            </div>
          </div>
          <div class="row">
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="1block"
                     step="0.1"
                     ng-model="host.settings.s.b"
                     ng-change="host.instant ? host.generate() : null">
              <label for="1block">
                Value of b for s-block (moonrise)
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="2block"
                     step="0.1"
                     ng-model="host.settings.p.b"
                     ng-change="host.instant ? host.generate() : null">
              <label for="2block">
                Value of b for p-block (noon)
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="3block"
                     step="0.1"
                     ng-model="host.settings.d.b"
                     ng-change="host.instant ? host.generate() : null">
              <label for="3block">
                Value of b for d-block (dawn)
              </label>
            </div>
            <div class="col s6 input-field">
              <input class="center-align"
                     type="number"
                     id="4block"
                     step="0.1"
                     ng-model="host.settings.f.b"
                     ng-change="host.instant ? host.generate() : null">
              <label for="4block">
                Value of b for f-block (twilight)
              </label>
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
