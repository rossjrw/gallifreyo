<template>
  <div class="card white">
    <div class="card-content black-text">
      <span class="card-title">
        Download
      </span>
      <div class="section">
        <div class="center-align">
          <a class="waves-effect waves-light btn section">
            SVG
          </a>
          <a class="waves-effect waves-light btn">
            PNG
          </a>
          <a class="waves-effect waves-light btn"
             ng-click="host.download('JSON')">
            JSON
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
