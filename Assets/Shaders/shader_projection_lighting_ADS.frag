#version 440 core
out vec4 vertColour;	//output colour of vertex
in vec2 textureCoordinate; //tex coords from vertex shader
in vec3 normals;
in vec3 fragmentPosition;
in vec3 lightColour;
in vec3 lightPosition;
in vec3 viewPosition;
in float time;

uniform sampler2D aTex;		//uniform holding texture info from main programme
uniform sampler2D bTex;		//uniform for secondary texture
uniform sampler2D cTex;	//uniform for noise nexture


void main()
{
	//ambient component
	//********************************
	//set the ambient coeff from material
	float lightAmbientStrength = 0.3f;
	vec3 objectAmbientReflectionCoeff = vec3(1.0f, 1.0f, 1.0f);
	vec3 ambient = (lightAmbientStrength * objectAmbientReflectionCoeff) * lightColour;
	
	//diffuse component
	//********************************
	//normalise normal vectors (reset them as unit vectors)
	vec3 nNormal = normalize(normals);
	//calculate the light direction from the light position and the fragment position
    vec3 lightDirection = normalize(lightPosition - fragmentPosition);
	
	//determine the dot product of normal direction and light direction
	float diffuseStrength = max(dot(nNormal, lightDirection), 0.0f);
	
	//combine this with the light colour
	//set the diffuse coeff from material
	vec3 objectDiffuseReflectionCoeff = vec3(1.0f, 1.0f, 1.0f);
    vec3 diffuse = (diffuseStrength * objectDiffuseReflectionCoeff) * lightColour;
	
	//specular component
	//**********************************
	float specularStrength = 0.9f;
	vec3 viewDirection = normalize(viewPosition - fragmentPosition);
    vec3 reflectDirection = reflect(-lightDirection, nNormal); 
	float sp = pow(max(dot(viewDirection, reflectDirection), 0.0), 8);
    vec3 specular = specularStrength * sp * lightColour; 

	//turn primary texture into RGBA
	vec4 primaryTextureColour = texture(aTex, textureCoordinate);
	//turn secondary texture into RGBA
	vec4 secondaryTextureColour = texture(bTex, textureCoordinate);
	//turn noise texture into RGBA
	vec4 noiseTextureColour = texture(cTex, textureCoordinate);


	//Dissolve Shader - Daniel Monk
	//**********************************

	
	float timevalue = cos((time/1000.0)+1)+.5;
	
	//Interpolate between two values 
    vec4 fade = smoothstep(timevalue-.2, timevalue, noiseTextureColour);

	//Create a vec4 of the color value used depending on fade state for either texture
	vec4 col = (1.-fade) * primaryTextureColour + fade * secondaryTextureColour;

	//Border which follows the fade to create fire dissolve effect
	vec4 border = smoothstep(0., .1, fade) - smoothstep(.1, 1., fade);
    //Color closest
	vec4 leadcol = vec4(1., .5, .1,1);
	//Color behind
	vec4 trailcol = vec4(0.2, .4, 1.,1);
	//mix both color values to create a eroding effect
    vec4 fire = mix(leadcol, trailcol, smoothstep(0.8, 1., border))*2.;
    
	//Add the border and fire effect
    col += border*fire;

	//textureColour.b = cos(time/10) + 5 * .5f;
 	//apply no lighting, ambient and diffuse components with colour contributed by texture
	//vertColour = (textureColour);
	//vertColour = textureColour;
	//vertColour = (vec4((lightColour), 1.0) * textureColour);
	//vertColour = (vec4((ambient),1.0) * textureColour);
	//vertColour = (vec4((ambient+diffuse),1.0) * textureColour);
	vertColour = (vec4((ambient+diffuse+specular),1.0) * col);
	
	
}