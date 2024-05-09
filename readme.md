This is my second API configured using node.js, express,js, and MongoDB, it is designed to manage and retrieve information related to U.S. states, such as fun facts, demographic details, and state identifiers. It interacts with a database where each state can have associated details such as its capital, nickname, population, date of admission, and an array of fun facts.

While these endpoints do not pass the automated test:
/states/ endpoint GET response: Records for KS, NE, OK, MO and CO have funfacts property‣
/states/ endpoint GET response: Records for KS, NE, OK, MO and CO have 3 or more fun facts‣
/states/ endpoint GET response: Records for NH, RI, GA, AZ and MT do not have funfacts property
/states/KS endpoint GET request should return the same response as if the parameter was ks, Ks, or kS. The parameter should be case-insensitive.

They are all correctly working and configured when applied to the Glitch website url. The 5 states that require fun facts are populated with four fun facts each and they are all accessible showing one random fact when called, the folowing 5 states do not have any fun facts applied and will return the exact {"message":"No Fun Facts found for New Hampshire"} or whatever inserted state is put in, again case-insenstivity works across all function. 
