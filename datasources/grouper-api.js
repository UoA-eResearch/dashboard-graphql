import { RESTDataSource } from 'apollo-datasource-rest';
import { performance } from 'perf_hooks';

export class GrouperAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.REGROUP_V2_API_BASE_URL;
    this.apiKey = process.env.REGROUP_V2_API_KEY;
  }

  willSendRequest(request) {
    request.headers.set('apikey', this.apiKey);
  }

  async getGroupMembers(groupnames) {
    const t0 = performance.now();
    groupnames = [].concat(groupnames); // handle string to array
    let results = [];
    for (var i = 0; i < groupnames.length; i++) {
      // convert groupnames to group id in regroup api format
      // example group id: eresearch.auckland.ac.nz:rvmf00088_vmuser
      const groupId = 'eresearch.auckland.ac.nz:' + groupnames[i];
      const result = await this.get(`group/${groupId}/member/users`);
      result['groupname'] = groupnames[i];
      results.push(result);
    }
    const t1 = performance.now();
    console.log(
      `Call to Grouper API getGroupMembers took ${t1 - t0} milliseconds.`);
    return results;
  }
}
