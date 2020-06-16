#include<iostream>

using namespace std;

class Test
{

};

class Test2:protected Test{};

int main()
{
    int i=10;
    static int j=i;
    if(j==i)
        printf("Equal");
    cout<<(5<<2);
    return 0;
}