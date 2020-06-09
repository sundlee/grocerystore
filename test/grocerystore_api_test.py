# -*- coding: utf-8 -*-
import http.client, base64, json, socket
# auth_data
auth_data = base64.b64encode(bytes(":".join(['auth_data_example', ""]), 'utf-8')).decode('utf-8')
# set host
host = "op-api-endpoint.ncsoft.com"
# get local ip
client = socket.gethostbyname(socket.gethostname())
# make headers
auth_string = "MyScheme {0};client={1}".format(auth_data, client)
headers = { "Authorization": auth_string, "Content-Type": "application/json" }
print("headers")
print(json.dumps(headers, indent=4, ensure_ascii=False))
# connect
conn = http.client.HTTPConnection(host)
# set ids
storeId = 613
stageId = 1377
base_uri = "/{0}/{1}/grocerystore/v1.0".format(storeId, stageId)

######################################################################
######################################################################
######################################################################

# get /${storeId}/${stageId}/grocerystore/v1.0/hello
method = "GET"
uri = "{0}/hello".format(base_uri)
print("{0} {1}".format(method, uri))
conn.request(method, uri, None, headers)
print(json.dumps(json.loads(conn.getresponse().read().decode('utf-8')), indent=4, ensure_ascii=False))

## post /${storeId}/${stageId}/supermarket/v1.0/mediation
#method = "POST"
#uri = "{0}/mediation".format(base_uri)
#print("{0} {1}".format(method, uri))
#conn.request(method, uri, {}, headers)
#print(json.dumps(json.loads(conn.getresponse().read().decode('utf-8')), indent=4, ensure_ascii=False))

# get /${storeId}/${stageId}/grocerystore/v1.0/groceries
method = "GET"
uri = "{0}/groceries".format(base_uri)
print("{0} {1}".format(method, uri))
conn.request(method, uri, None, headers)
print(json.dumps(json.loads(conn.getresponse().read().decode('utf-8')), indent=4, ensure_ascii=False))

# get /${storeId}/${stageId}/grocerystore/v1.0/groceries/1
method = "GET"
uri = "{0}/groceries/1".format(base_uri)
print("{0} {1}".format(method, uri))
conn.request(method, uri, None, headers)
print(json.dumps(json.loads(conn.getresponse().read().decode('utf-8')), indent=4, ensure_ascii=False))

# post /${storeId}/${stageId}/supermarket/v1.0/groceries { 'name': 'carrot', 'price': 3 }
method = "POST"
uri = "{0}/groceries".format(base_uri)
print("{0} {1}".format(method, uri))
conn.request(method, uri, json.dumps({ 'name': 'watermelon', 'price': 6 }), headers)
response = conn.getresponse()
response_data = response.read().decode('utf-8')
json_data = json.loads(response_data)
print(json.dumps(json_data, indent=4, sort_keys=True))
id = json_data['id']

## put /${storeId}/${stageId}/supermarket/v1.0/groceries/5
method = "PUT"
uri = "{0}/groceries/{1}".format(base_uri, id)
print("{0} {1}".format(method, uri))
conn.request(method, uri, json.dumps({ 'name': 'onion', 'price': 2 }), headers)
print(json.dumps(json.loads(conn.getresponse().read().decode('utf-8')), indent=4, ensure_ascii=False))

# delete /${storeId}/${stageId}/supermarket/v1.0/groceries/2
method = "DELETE"
uri = "{0}/groceries/{1}".format(base_uri, id)
print("{0} {1}".format(method, uri))
conn.request(method, uri, None, headers)
response = conn.getresponse()
print('Status : ', response.status, response.reason)

