import { RESTDataSource } from 'apollo-datasource-rest';

export class GrouperAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.REGROUP_V2_API_BASE_URL;
    this.apiKey = process.env.REGROUP_V2_API_KEY;
  }

  willSendRequest(request) {
    request.headers.set('apikey', this.apiKey);
  }

  async getGroupMembers(groupId) {
    // example group id: eresearch.auckland.ac.nz:rvmf00088_vmuser
    return this.get(`group/${groupId}/member/users`);
  }
}
