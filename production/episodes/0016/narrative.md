# Episode 16 – Basic implementation

> **Question:** *Does this architecture actually work when we build it?*

## Opening

That's the question for this episode.

Hello, I'm Russell, and welcome to Episode 16 of the Articulate Journal, where I'm exploring what it takes to build an AI-native architecture from first principles.

In the previous episode, I explored architectural assurance.

In this episode, Articulate will be born, starting with some foundations around the knowledge model and the agent runtime. I will show the implementation so far implementing two capabilities:

- Capture Proposed Knowledge 
- Review Proposed Claim

## (screen share) [vscode]

### Capture Proposed Knowledge

Starting with the Capture Proposed Knowledge capability, its described using DCL, the Declarative Capability Language. I have the DCL vscode extension installed that allows vscode to include syntax highlighing, compiler and language server protocol so vscode can navigate code structures. It has a graph workspace that has various visuals like a capability map. As the episodes progress and more capabilities are added, these graphs will become very useful.

To briefly explain this capability, in DCL you can see the keyword context, context is like a bounded context in domain driven design. a context can contain one or many capabilities and other elements. 

We have actors defined, actors can be of different types, we have humam, systems and agents defined currently.

We have effects, effects could be seen as I\O bound activities, like persistenance or notifications. other types of effects tools and invocations can be used.

various other constructs can be declared like policies and shapes.

DCL supports multiple files. I have a another dcl file called shapes with includes the claim shape. A shape is data type like a record or an enum, we have a shape called claim, it has fields that can be build in data types or other shapes. DCL supports a level of domain modelling. 

Looking at the capability now, it has a number of intents where various actors can supply the claim. Every capability has an outcome, here we see two outcomes. The effects block shows that the capability uses this effect and in order in which effects are used. 

the observe block defines what metrics are important and need to be observed as part of the capability.

The when block defines the mapping of the outcomes of the capability with the results from rules, policies and effects. the invarients

This capabiliy is as simple as it comes. a claim can be supplied from various actors, its persisted, then a notification is sent. Happy path returns a captured outcome, else the outcomes returns rejected. 

The beauity of DCL is that it describes the intent and as a compiled language is verifies that all outcomes and rules are valid. It is designed to not descibe technology or get into the how. Its about behavioural intent that can be executed. 

The step is to produce some code, my environment is simple, I use Codex as my coding agent. I have an Agents.md file in the root that is architectural and I have an agents.md in the source code folder which outlines the rules and contraints at language level. I have some skills for plan, implement and verify stages. I have also added the DCL MCP server so that it can fully understand the capability rather than use it as text. DCL really helps the context the model needs as it provides semantic intent

DCL descibes the behavior, C4 descibes the structure. 

[Browser]
I use C4 during the design process, here is a very basic diagram. which relates to the capbility we have used looked at. The addition is the Claim Simulator. this service is purely for testing where I will have named scenarios that will throw a collection of claims at the knowledge api. this will be key to testing and demostrating Articulate as development evolves.  

The knowledge api will persist claims to a data store.

### Review Proposed claim

This now provides a baseline for the first agent being Review Proposed claim. The goal of the agent to look at the claim and assess that the statement is architectural and it will store the status about the claim. this will act as the first filter in evolving claims .


[vscode]
Looking at the Review Proposed claim DCL code, its part of the same bounded context and it has an actor being the messaging system where its a consumer to a notification. This capability uses some specific shapes and has an effect where its using a tool. A couple of policies have been defined, a policy can contain one or more families of characteristics like availability, performance, security etc.

In the capability, we have covered some of the blocks earlier, but we have the polcies block that maps the policies to parts of the capability. In the When block, a policy is used to control the outcome. The last block is the lifecycle, this is not a full blown workflow language but enough to define the steps and the transistions which can be triggered with events. 

Going to compile the dcl and flip over to the graph workspace. the architecture oberview shows the two capabilities under the context. not that exciting, the capability graph show a visual of the capibility, switching the layout shows the input, the comes etc. Other views exist and we can cover them another time.

The structure now changes, the C4 evolves now to this, we can view the diagram here.

[browser] but using the structuriser playground, it nicer on the eye.

[vscode]
The code has been created for these services. DAPR Agents is configured and the docker compose is in place to run the services. we will see that shortly. 

I really like "prompty", a bit of front matter and it nice to have the prompt under source control as a specific file.

In addition to Dapr agents, also using blocking buildings used secrets, pub/sub, OpenTelemetry, conversation as well. The LM I am using locally is running on a separate m4 mac mini. Using Gemma3.12b with Ollama. 

The structure of the architect now looks different. Much has been said about the Knowledge model and I have not made a dicussion on the technology, but to get started I am just going to use MongoDb. Its flexible and just works with very litte effort to start with. 

[browser]. The architecture is changing. this feels like a good start. 

[mongo]
As a quick demo, the mongo database is empty

[vscode]
Running docker compose

[browser]
In the swagger docs, going to run this GET endpoint, which will return a couple of scenarios. Going to grab this one, and pass the string into this POST endpoint. That will have create a bunch of claims that would be captured, messages will be flowing through rabbitMQ and the agent will be reviewed all the claims and determined if the statement in each claim was an architectural statement.

[Mongo]
If I refresh the database, we can see the claims and the result from the agent.

DAPR also comes with Zipkin, here we can see the trace. This is great for a normal application.



[Narrator]
with agents I want to observe and evalute the agents, that the topic for the next episode. That concludes the demo. Thanks for watching. See you on the next one.



