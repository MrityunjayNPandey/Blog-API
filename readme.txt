Objective: 
Create a backend API with User, Blog, and Comment models. Implement logic for determining friends based on comments on blogs.

To add items to the Users:
Give a POST request to "https://blog-api-seven-pi.vercel.app/users" with "name" and "email" within the body(In JSON format).

To add items to the Blogs(associated with user):
Give a POST request to "https://blog-api-seven-pi.vercel.app/blogs" with "title", "content" and "authorID"(the object id that you get while making User object) within the body(In JSON format).

To add items to the Comments(associated with Blogs and user):
Give a POST request to "https://blog-api-seven-pi.vercel.app/comments" with "content", "userId"(the object id that you get while making User object) and "blogId"(the object id that you get while making Blog object) within the body(In JSON format).

To know list of all friends of that level for given userId:
Give a GET request to "https://blog-api-seven-pi.vercel.app/users/<userId>/level/<levelNo>", the result will be a list of userId.

This is how the algorithm works:

1. The endpoint is a GET request that takes in two parameters from the URL: userId and levelNo, which represent the ID of the user and the desired level of friends, respectively.

2. Inside the try-catch block, the code first tries to find the user with the provided userId using User.findById(userId). If the user is not found, it returns a 404 status code with an error message.

3. Next, a Set named friends is created to store the friends of the user. Using a Set helps to avoid duplicates in the result set.

4. The code then calls a helper function getFriends() to recursively get the friends of the user up to the given levelNo parameter.

5. The getFriends() function takes in the user, level, and friends set as parameters. It first checks if the level is 0, and if so, it returns, as no further friends need to be fetched.

6. If the level is not 0, it fetches the comments made by the user using Comment.find({ user: user._id }).populate("blog") and populates the associated blog for each comment.

7. Then, it iterates through the comments and fetches the comments made on the same blog by other users, populating the user field for each blog comment.

8. The user IDs of these first-level friends are added to the friends set.

9. Next, it recursively calls the getFriends() function for each first-level friend to fetch their friends up to the desired level, decrementing the level by 1 in each recursive call.

10. Finally, the friends set is converted to an array and sent as the response in JSON format using res.json(Array.from(friends)).

11. If any error occurs during the process, it catches the error, logs it, and sends a 500 status code with an error message in the response.


Here's the Assignment:

Programming Assignment (Backend)
1. The objective is to create a backend API with User, Blog and Comment
models. A Blog is created by a User and any User can create a Comment
on any blog.
2. Create a database with sample data, using a database of your choice.
3. Consider all users who have commented on the same blog as friends (1st
level friend).
4. A friend is 2nd level friend if they have commented on a blog where a 1st
level friend has also commented but has not commented on any common
blog.
5. Example - Blog1 has the comment of {User1, User2}, Blog2 has the
comment of {User1, User3}. Here User2 and User3 are 2nd level friends if
there exists no blog which has the comment of User2 and User3.
6. Similar to above there can be third level friend and k-th level friends (
LinkedIn shows this kind of friend level).
7. Using REST or GraphQL, implement read and create APIs for Users, Blogs
and Comments.
8. Also create an API (again REST or GraphQL as above) to return all the n-th
level friends of a given user, where n is an input number. (Example with
REST API: GET /users/<userId>/level/<levelNo> which should give list of all
friends of that level for given userId (ex- /users/1234/level/1 for first level
friend).
9. Use high standard design principles while implementing the solution.
10.Write modular and clean code with comments keeping in mind scalability
and manageability of code.
Judging criteria will be
1. Quality of the solution, and attention to detail on data model.
2. Quality of code, best practices being followed, etc.
3. We use NodeJs and MongoDb for our backend, but for this assignment any
backend language and database choice are accepted.
Submission:
1. Github link with steps to run and execute the code.
2. A README on the Github explaining the approach taken.