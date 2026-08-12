const Note = require('../models/Note');
const NoteComment = require('../models/NoteComment');

const SEED_DATA = [
  // JAVA NOTES
  {
    language: 'Java',
    title: '1. Fundamentals of Java & JVM / JRE Architecture',
    content: `### Java Architecture & Runtime Infrastructure

Java is a compiled and interpreted programming language.

#### Key Components:
- **JDK (Java Development Kit)**: Contains development tools (javac compiler, debugger) + JRE.
- **JRE (Java Runtime Environment)**: Contains class libraries (rt.jar/modules) + JVM runtime environment.
- **JVM (Java Virtual Machine)**: Abstract computing machine that executes Java bytecode (.class files).

#### Bytecode Execution Pipeline:
1. Source Code (\`.java\`) -> Compiled by \`javac\` -> Bytecode (\`.class\`)
2. Loaded by **ClassLoader** into Memory Data Areas.
3. Executed by **Execution Engine** (Interpreter + JIT Compiler + Garbage Collector).
4. Interacts with OS using **JNI (Java Native Interface)**.

\`\`\`java
public class Fundamentals {
    public static void main(String[] args) {
        System.out.println("Java Environment: " + System.getProperty("java.version"));
    }
}
\`\`\`
`
  },
  {
    language: 'Java',
    title: '2. Java Memory Model & Garbage Collection Mechanics',
    content: `### Memory Structure & Garbage Collectors

Java manages memory automatically via the Garbage Collector in the JVM.

#### JVM Memory Organization:
- **Heap Memory**: Stores objects & class instances (shared across threads).
  - **Young Generation**: Eden Space, Survivor Space S0 & S1 (Minor GC runs here).
  - **Old Generation (Tenured)**: Long-surviving objects (Major / Full GC runs here).
- **Metaspace**: Stores class metadata, structure, static constants (off-heap memory since Java 8).
- **Stack Memory**: Stores primitive local variables and method call stack frames per thread.
- **Program Counter (PC) Register**: Holds current executing instruction address per thread.

#### Modern Garbage Collectors:
- **G1GC (Garbage-First)**: Region-based collector designed for large heap sizes.
- **ZGC / Shenandoah**: Ultra low-latency concurrent garbage collectors (<1ms pause times).

\`\`\`java
// Checking Heap Memory at Runtime
Runtime runtime = Runtime.getRuntime();
long maxMemory = runtime.maxMemory();
long allocatedMemory = runtime.totalMemory();
long freeMemory = runtime.freeMemory();
\`\`\`
`
  },
  {
    language: 'Java',
    title: '3. Classes, Objects, Methods & Constructor Mechanics',
    content: `### Object-Oriented Structure in Java

A class defines blue-prints; objects are instantiated runtime units.

#### Key Principles:
- **Pass-By-Value**: Java is strictly pass-by-value. Object references are copied by value!
- **Constructor Chaining**: Invoking parent class constructors via \`super()\`.
- **Method Overloading vs Overriding**:
  - Overloading: Same method name, different parameter signature (Compile-time).
  - Overriding: Same signature in subclass with \`@Override\` annotation (Runtime polymorphism).

\`\`\`java
public class Car {
    private String model;
    private int horsePower;

    public Car(String model, int horsePower) {
        this.model = model;
        this.horsePower = horsePower;
    }

    public void startEngine() {
        System.out.println(model + " engine started (" + horsePower + " HP)");
    }
}
\`\`\`
`
  },
  {
    language: 'Java',
    title: '4. Object-Oriented Programming (OOPS) Deep Dive',
    content: `### The 4 Pillars of OOP in Java

1. **Encapsulation**: Hiding state behind private fields and exposing controlled getters/setters.
2. **Inheritance**: Extending functionality via \`extends\` keyword (single inheritance for classes).
3. **Polymorphism**: Treating derived objects as base references.
4. **Abstraction**: Hiding implementation details via \`abstract\` classes or \`interface\`.

\`\`\`java
public interface Vehicle {
    void accelerate();
    default void horn() {
        System.out.println("Beep Beep!");
    }
}

public class ElectricCar implements Vehicle {
    @Override
    public void accelerate() {
        System.out.println("Instant electric torque delivery!");
    }
}
\`\`\`
`
  },
  {
    language: 'Java',
    title: '5. Java Multithreading & Concurrency Architecture',
    content: `### Concurrent Execution & Thread Pools

Multithreading allows running multiple execution paths concurrently inside a single process.

#### Core Synchronization Controls:
- **synchronized**: Reentrant lock mechanism preventing concurrent thread entry.
- **volatile**: Guarantees variable visibility across CPU thread caches directly to main memory.
- **ExecutorService & ThreadPools**: Avoids thread creation overhead by reusing fixed worker pools.

\`\`\`java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ConcurrencyDemo {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(4);
        
        executor.submit(() -> {
            System.out.println("Async Worker Thread: " + Thread.currentThread().getName());
        });
        
        executor.shutdown();
    }
}
\`\`\`
`
  },
  {
    language: 'Java',
    title: '6. Collections Framework & Functional Streams API',
    content: `### Data Structures & Functional Stream Operations

Java Collections provides high-performance data structures in \`java.util\`.

#### Collection Types:
- **List**: \`ArrayList\` (dynamic array), \`LinkedList\` (doubly linked).
- **Set**: \`HashSet\` (hash-table lookup), \`TreeSet\` (Sorted Red-Black Tree).
- **Map**: \`HashMap\` (O(1) average lookup, turns buckets into trees when collisions > 8).

#### Java 8 Streams Operations:
\`\`\`java
List<String> names = List.of("Java", "Spring", "Microservices", "Docker");

List<String> filtered = names.stream()
    .filter(name -> name.startsWith("S") || name.startsWith("J"))
    .map(String::toUpperCase)
    .sorted()
    .toList();
\`\`\`
`
  },

  // SPRING BOOT NOTES
  {
    language: 'Spring Boot',
    title: '1. Spring Boot Core Architecture & Dependency Injection (IoC)',
    content: `### Spring Inversion of Control & Beans Management

Spring Boot automatically configures applications with opinionated defaults.

#### Essential Annotations:
- \`@SpringBootApplication\`: Combines \`@Configuration\`, \`@EnableAutoConfiguration\`, and \`@ComponentScan\`.
- \`@Component\`, \`@Service\`, \`@Repository\`, \`@Controller\`, \`@RestController\`.
- \`@Autowired\`: Constructor injection (Recommended over field injection).

#### Bean Scopes:
- **Singleton** (Default): Single shared instance per Spring IoC Container.
- **Prototype**: New instance created on every request.
- **Request / Session**: Scoped per HTTP Request / Web Session.

\`\`\`java
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
\`\`\`
`
  },
  {
    language: 'Spring Boot',
    title: '2. Spring Data JPA, Hibernate ORM & Database Access',
    content: `### Database Object-Relational Mapping

Spring Data JPA simplifies database operations by abstracting SQL queries into repository interfaces.

#### Annotations & Mapping:
- \`@Entity\`, \`@Table(name = "users")\`, \`@Id\`, \`@GeneratedValue(strategy = GenerationType.IDENTITY)\`
- Relationships: \`@OneToMany\`, \`@ManyToOne\`, \`@ManyToMany\` with \`FetchType.LAZY\` or \`EAGER\`.

\`\`\`java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findAllActiveUsers();
}
\`\`\`
`
  },
  {
    language: 'Spring Boot',
    title: '3. Building REST APIs & Global Exception Handling',
    content: `### Web RESTful Controller Architecture

Build clean RESTful endpoints returning JSON responses with proper HTTP status codes.

#### Annotations:
- \`@RestController\`, \`@RequestMapping("/api/v1/users")\`
- \`@GetMapping\`, \`@PostMapping\`, \`@PutMapping\`, \`@DeleteMapping\`
- \`@PathVariable\`, \`@RequestParam\`, \`@RequestBody\`, \`@Valid\`

\`\`\`java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
}
\`\`\`
`
  },
  {
    language: 'Spring Boot',
    title: '4. Spring Security, JWT Authentication & Filter Chain',
    content: `### Securing APIs with Spring Security & JWT

Protect endpoints using modern \`SecurityFilterChain\` configuration.

#### Core Concepts:
- **SecurityFilterChain**: Configures CORS, CSRF, URL authorization rules, and custom filters.
- **BCryptPasswordEncoder**: Hashes user passwords securely.
- **OncePerRequestFilter**: Intercepts HTTP headers to validate Bearer JWT tokens.

\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
\`\`\`
`
  }
];

// Add a new note
exports.addNote = async (req, res) => {
  try {
    const { language, title, content } = req.body;
    const newNote = new Note({
      language,
      title,
      content
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' });
  }
};

// Get all notes (auto-seeds if empty)
exports.getAllNotes = async (req, res) => {
  try {
    let notes = await Note.find();
    if (notes.length === 0) {
      notes = await Note.insertMany(SEED_DATA);
    }
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

// Get distinct languages (auto-seeds if empty)
exports.getDistinctLanguages = async (req, res) => {
  try {
    let languages = await Note.distinct('language');
    if (!languages || languages.length === 0) {
      await Note.insertMany(SEED_DATA);
      languages = await Note.distinct('language');
    }
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching languages' });
  }
};

// Get notes by language
exports.getNotesByLanguage = async (req, res) => {
  try {
    const notes = await Note.find({ language: req.params.language });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

// Delete a single note
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
};

// Clear existing notes and seed Java & Spring Boot content
exports.seedNotes = async (req, res) => {
  try {
    await Note.deleteMany({});
    const inserted = await Note.insertMany(SEED_DATA);
    res.json({ message: 'Notes cleared and seeded successfully', count: inserted.length, data: inserted });
  } catch (error) {
    console.error('Error seeding notes:', error);
    res.status(500).json({ message: 'Error seeding notes', error });
  }
};

// Q&A Note Comments Controller
exports.getNoteComments = async (req, res) => {
  try {
    const comments = await NoteComment.find({ noteId: req.params.noteId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note comments' });
  }
};

exports.addNoteComment = async (req, res) => {
  try {
    const { author, authorRole, text } = req.body;
    const comment = new NoteComment({
      noteId: req.params.noteId,
      author: author || 'Student Developer',
      authorRole: authorRole || 'student',
      text
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error posting note comment' });
  }
};