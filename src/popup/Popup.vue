<template>
  <div class="container">
    <div style="min-height: 108px;">
      <a-table
        :dataSource="contests"
        rowKey="hash"
        :loading="loading"
        :pagination="false"
        @change="handleTableChange"
      >
        <a-table-column
          title="Platform"
          dataIndex="source"
          key="source"
          :width="140"
          :filters="availableFilters"
          :filteredValue="filtered"
        />

        <a-table-column
          title="Name"
          dataIndex="name"
          key="name"
        >
          <template slot-scope="text, record">
            <span>
              <a v-if="isComingSoon(record)" :href="record.link" target="_blank">
                {{record.name}} <a-tag color="blue">{{getStartTimeToNow(record)}}</a-tag>
              </a>
              <a v-else-if="getTimeStatus(record) === 'Running'" :href="record.link" target="_blank">
                {{record.name}} <a-icon type="clock-circle" />
              </a>
              <a v-else :href="record.link" target="_blank">{{record.name}}</a>
            </span>
          </template>
        </a-table-column>

        <a-table-column
          title="Start"
          dataIndex="start_time"
          key="start_time"
          :width="160"
        >
          <template slot-scope="start_time">
            <span>{{formatTime(start_time)}}</span>
          </template>
        </a-table-column>

        <a-table-column
          title="End"
          dataIndex="end_time"
          key="end_time"
          :width="160"
        >
          <template slot-scope="end_time">
            <span>{{formatTime(end_time)}}</span>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <div class="text-center" style="margin-top: 15px;">
      <a-button @click="refreshData" size="small">Refresh Data</a-button>
    </div>

    <div class="text-center" style="margin-top: 30px;">
      <p>
        <a href="https://github.com/dreamerblue/recent_contests" target="_blank">GitHub</a> |
        <a href="https://contests.sdutacm.cn/" target="_blank">Data Source</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { get } from '@/utils/request';
  import api from '@/configs/api';
  import moment from 'moment';
  import ls from '@/utils/localStorage';
  import { ColumnFilterItem } from 'ant-design-vue/types/table/column';

  enum lsKeys {
    filteredPlatforms = 'filteredPlatforms',
  }

  export default Vue.extend({
    name: 'Popup',
    data(): {
      loading: boolean
      contests: IContest[];
      filters: string[];
      filtered: string[];
    } {
      return {
        loading: false,
        contests: [],
        filters: [],
        filtered: [],
      };
    },
    computed: {
      availableFilters(): ColumnFilterItem[] {
        return this.filters.map(f => ({
          text: f,
          value: f,
        }));
      },
    },
    mounted() {
      this.filtered = ls.get(lsKeys.filteredPlatforms) || [];
      this.fetchStatus();
      this.fetchContests();
    },
    methods: {
      async fetchStatus() {
        try {
          const statusData: IApiResponseStatus = await get(api.status);
          console.log('[fetch] status:', statusData);
          this.filters = statusData.updated_at.map(platform => platform.source);
          if (!this.filtered.length) {
            this.filtered = [...this.filters];
          }
        } catch (err) {
          console.error(err);
          this.$message.error(err.toString());
        }
      },
      async fetchContests() {
        this.loading = true;
        try {
          const contestsData: ApiResponseContests = await get(api.contests, { include: this.filtered });
          console.log('[fetch] contests:', contestsData);
          this.contests = contestsData.filter(c => moment().subtract(3, 'd').isBefore(c.start_time));
        } catch (err) {
          console.error(err);
          this.$message.error(err.toString());
        }
        this.loading = false;
      },
      refreshData() {
        this.fetchStatus();
        this.fetchContests();
        window.scrollTo(0, 0);
      },
      handleTableChange(pagination: { current: number, pageSize: number }, filters: { source: any[] }) {
        if (!filters.source.length) {
          this.filtered = [...this.filters];
        } else {
          this.filtered = filters.source;
        }
        if (!filters.source.length || [...filters.source].sort().toString() === [...this.filters].sort().toString()) {
          ls.remove(lsKeys.filteredPlatforms);
        } else {
          ls.set(lsKeys.filteredPlatforms, filters.source);
        }
        this.fetchContests();
        // window.scrollTo(0, 0);
      },
      formatTime(time: string): string {
        return moment(time).format('YYYY-MM-DD HH:mm');
      },
      getTimeStatus(contest: IContest) {
        if (moment().isBefore(contest.start_time)) {
          return 'Pending';
        } else if (moment().isBefore(contest.end_time)) {
          return 'Running';
        }
        return 'Ended';
      },
      isComingSoon(contest: IContest) {
        return this.getTimeStatus(contest) === 'Pending' && moment().add(3, 'd').isAfter(contest.start_time);
      },
      getStartTimeToNow(contest: IContest) {
        return moment(contest.start_time).fromNow();
      },
    },
  });
</script>

<style lang="less" scoped>
  .container {
    width: 800px;
  }

  .text-center {
    text-align: center;
  }
</style>
