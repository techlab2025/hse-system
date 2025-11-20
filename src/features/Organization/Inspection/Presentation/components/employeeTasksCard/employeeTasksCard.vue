<template>
  <div class="inspection-show">
    <div class="inspection-show-title">
      <EmployeeIconCard />
      <h5>{{ $t('employee') }}</h5>
    </div>
    <div class="cards">
      <div class="employee-card">
        <div class="info">
          <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" />
          <div class="employee-info">
            <h4 class="employee-name">ahmed hawam</h4>
            <h5 class="employee-role">Team leader</h5>
          </div>
        </div>
        <div class="tasks-num">5 {{ $t('tasks') }}</div>
      </div>
      <div class="employee-tasks">
        <div class="task-card" v-for="task in 8" :key="task">
          <h4>device inspection</h4>
          <div class="date">
            <span>{{ $t('date') }} : </span>
            <p>Daily</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
